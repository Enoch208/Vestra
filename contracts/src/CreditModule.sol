// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "./interfaces/IERC20.sol";
import {IReputationSink, REP_REPAYMENT, REP_DEFAULT} from "./interfaces/IReputationSink.sol";
import {SavingsVault} from "./SavingsVault.sol";

contract CreditModule {
    enum Status {
        None,
        Active,
        Repaid,
        Defaulted
    }

    struct Advance {
        uint128 principal;
        uint128 outstanding;
        uint128 collateral;
        uint64 dueDate;
        Status status;
    }

    SavingsVault public immutable vault;
    IERC20 public immutable token;
    address public guardian;
    IReputationSink public reputation;

    uint16 public constant COLLATERAL_BPS = 10000;
    uint64 public constant DURATION = 30 days;
    uint256 public hardCap;

    mapping(address => Advance) public advances;

    event AdvanceIssued(address indexed user, uint256 principal, uint256 collateral, uint64 dueDate);
    event Repayment(address indexed user, uint256 amount, uint256 outstanding);
    event AdvanceRepaid(address indexed user, uint256 principal);
    event Defaulted(address indexed user, uint256 seized, uint256 outstanding);
    event HardCapSet(uint256 hardCap);
    event ReputationSet(address indexed reputation);

    error NotGuardian();
    error ActiveAdvanceExists();
    error NoActiveAdvance();
    error ZeroAmount();
    error ExceedsEligible();
    error NotDue();
    error TransferFailed();
    error Reentrancy();

    uint256 private _lock = 1;

    modifier nonReentrant() {
        if (_lock != 1) revert Reentrancy();
        _lock = 2;
        _;
        _lock = 1;
    }

    modifier onlyGuardian() {
        if (msg.sender != guardian) revert NotGuardian();
        _;
    }

    constructor(address vault_, address guardian_, uint256 hardCap_) {
        vault = SavingsVault(vault_);
        token = SavingsVault(vault_).token();
        guardian = guardian_;
        hardCap = hardCap_;
    }

    function setHardCap(uint256 hardCap_) external onlyGuardian {
        hardCap = hardCap_;
        emit HardCapSet(hardCap_);
    }

    function setReputation(address reputation_) external onlyGuardian {
        reputation = IReputationSink(reputation_);
        emit ReputationSet(reputation_);
    }

    function eligibleAmount(address user) public view returns (uint256) {
        if (advances[user].status == Status.Active) return 0;
        uint256 avail = vault.available(user);
        return avail < hardCap ? avail : hardCap;
    }

    function requestAdvance(uint128 amount) external nonReentrant {
        Advance storage adv = advances[msg.sender];
        if (adv.status == Status.Active) revert ActiveAdvanceExists();
        if (amount == 0) revert ZeroAmount();
        if (amount > eligibleAmount(msg.sender)) revert ExceedsEligible();

        uint128 collateral = uint128((uint256(amount) * COLLATERAL_BPS) / 10000);
        vault.lockCollateral(msg.sender, collateral);

        uint64 dueDate = uint64(block.timestamp) + DURATION;
        advances[msg.sender] = Advance({
            principal: amount,
            outstanding: amount,
            collateral: collateral,
            dueDate: dueDate,
            status: Status.Active
        });

        _sendToken(msg.sender, amount);
        emit AdvanceIssued(msg.sender, amount, collateral, dueDate);
    }

    function repay(uint256 amount) external nonReentrant {
        Advance storage adv = advances[msg.sender];
        if (adv.status != Status.Active) revert NoActiveAdvance();
        if (amount == 0) revert ZeroAmount();

        uint256 pay = amount > adv.outstanding ? adv.outstanding : amount;
        _pullToken(msg.sender, pay);
        adv.outstanding -= uint128(pay);

        if (adv.outstanding == 0) {
            adv.status = Status.Repaid;
            vault.releaseCollateral(msg.sender, adv.collateral);
            emit AdvanceRepaid(msg.sender, adv.principal);
            if (address(reputation) != address(0)) {
                reputation.record(msg.sender, REP_REPAYMENT, adv.principal, true);
            }
        } else {
            emit Repayment(msg.sender, pay, adv.outstanding);
        }
    }

    function handleDefault(address user) external nonReentrant {
        Advance storage adv = advances[user];
        if (adv.status != Status.Active) revert NoActiveAdvance();
        if (block.timestamp <= adv.dueDate) revert NotDue();

        uint256 outstanding = adv.outstanding;
        uint128 seize = adv.collateral;
        if (seize > outstanding) seize = uint128(outstanding);

        vault.seizeCollateral(user, seize, address(this));
        adv.outstanding -= seize;

        uint128 leftover = adv.collateral - seize;
        if (leftover > 0) {
            vault.releaseCollateral(user, leftover);
        }

        adv.status = Status.Defaulted;
        emit Defaulted(user, seize, adv.outstanding);
        if (address(reputation) != address(0)) {
            reputation.record(user, REP_DEFAULT, outstanding, false);
        }
    }

    function _pullToken(address from, uint256 amount) private {
        bool ok = token.transferFrom(from, address(this), amount);
        if (!ok) revert TransferFailed();
    }

    function _sendToken(address to, uint256 amount) private {
        bool ok = token.transfer(to, amount);
        if (!ok) revert TransferFailed();
    }
}
