// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "./interfaces/IERC20.sol";
import {IReputationSink, REP_CONTRIBUTION, REP_MISSED} from "./interfaces/IReputationSink.sol";

contract SavingsVault {
    struct Account {
        uint128 balance;
        uint128 lockedCollateral;
        uint64 dailyAmount;
        uint64 lastPullAt;
        uint32 streak;
        uint32 missedCount;
        bool active;
    }

    IERC20 public immutable token;
    address public agent;
    address public guardian;
    address public creditModule;
    IReputationSink public reputation;
    bool public paused;

    uint64 public constant PULL_WINDOW = 1 days;
    uint64 public constant GRACE = 6 hours;

    mapping(address => Account) public accounts;
    mapping(address => bool) public verified;

    event AccountOpened(address indexed user, uint64 dailyAmount);
    event DailyAmountChanged(address indexed user, uint64 dailyAmount);
    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event ContributionMade(address indexed user, uint256 amount, uint32 streak);
    event Missed(address indexed user, uint32 missedCount);
    event CollateralLocked(address indexed user, uint256 amount);
    event CollateralReleased(address indexed user, uint256 amount);
    event CollateralSeized(address indexed user, uint256 amount, address indexed to);
    event Verified(address indexed user, bool status);
    event Paused(bool status);
    event AgentChanged(address indexed agent);
    event CreditModuleSet(address indexed creditModule);
    event ReputationSet(address indexed reputation);

    error NotAgent();
    error NotGuardian();
    error NotCreditModule();
    error IsPaused();
    error NotVerified();
    error AlreadyActive();
    error NotActive();
    error ZeroAmount();
    error WindowNotOpen();
    error InsufficientAvailable();
    error InsufficientLocked();
    error TransferFailed();
    error Reentrancy();

    uint256 private _lock = 1;

    modifier nonReentrant() {
        if (_lock != 1) revert Reentrancy();
        _lock = 2;
        _;
        _lock = 1;
    }

    modifier onlyAgent() {
        if (msg.sender != agent) revert NotAgent();
        _;
    }

    modifier onlyGuardian() {
        if (msg.sender != guardian) revert NotGuardian();
        _;
    }

    modifier onlyCreditModule() {
        if (msg.sender != creditModule) revert NotCreditModule();
        _;
    }

    modifier whenNotPaused() {
        if (paused) revert IsPaused();
        _;
    }

    constructor(address token_, address agent_, address guardian_) {
        token = IERC20(token_);
        agent = agent_;
        guardian = guardian_;
    }

    function available(address user) public view returns (uint256) {
        Account storage a = accounts[user];
        return a.balance - a.lockedCollateral;
    }

    function setVerified(address user, bool status) external onlyAgent {
        verified[user] = status;
        emit Verified(user, status);
    }

    function setCreditModule(address creditModule_) external onlyGuardian {
        creditModule = creditModule_;
        emit CreditModuleSet(creditModule_);
    }

    function setReputation(address reputation_) external onlyGuardian {
        reputation = IReputationSink(reputation_);
        emit ReputationSet(reputation_);
    }

    function setAgent(address agent_) external onlyGuardian {
        agent = agent_;
        emit AgentChanged(agent_);
    }

    function openAccount(uint64 dailyAmount) external whenNotPaused {
        if (!verified[msg.sender]) revert NotVerified();
        Account storage a = accounts[msg.sender];
        if (a.active) revert AlreadyActive();
        if (dailyAmount == 0) revert ZeroAmount();
        a.active = true;
        a.dailyAmount = dailyAmount;
        emit AccountOpened(msg.sender, dailyAmount);
    }

    function setDailyAmount(uint64 dailyAmount) external {
        Account storage a = accounts[msg.sender];
        if (!a.active) revert NotActive();
        if (dailyAmount == 0) revert ZeroAmount();
        a.dailyAmount = dailyAmount;
        emit DailyAmountChanged(msg.sender, dailyAmount);
    }

    function deposit(uint256 amount) external nonReentrant whenNotPaused {
        Account storage a = accounts[msg.sender];
        if (!a.active) revert NotActive();
        if (amount == 0) revert ZeroAmount();
        _pullToken(msg.sender, amount);
        a.balance += uint128(amount);
        emit Deposited(msg.sender, amount);
    }

    function withdraw(uint256 amount) external nonReentrant {
        if (amount == 0) revert ZeroAmount();
        if (amount > available(msg.sender)) revert InsufficientAvailable();
        accounts[msg.sender].balance -= uint128(amount);
        _sendToken(msg.sender, amount);
        emit Withdrawn(msg.sender, amount);
    }

    function pullContribution(address user) external onlyAgent nonReentrant whenNotPaused {
        Account storage a = accounts[user];
        if (!a.active) revert NotActive();
        if (block.timestamp < uint256(a.lastPullAt) + PULL_WINDOW - GRACE) revert WindowNotOpen();

        uint256 amount = a.dailyAmount;
        a.lastPullAt = uint64(block.timestamp);

        bool ok;
        try token.transferFrom(user, address(this), amount) returns (bool success) {
            ok = success;
        } catch {
            ok = false;
        }

        if (ok) {
            a.balance += uint128(amount);
            a.streak += 1;
            emit ContributionMade(user, amount, a.streak);
            if (address(reputation) != address(0)) {
                reputation.record(user, REP_CONTRIBUTION, amount, true);
            }
        } else {
            a.streak = 0;
            a.missedCount += 1;
            emit Missed(user, a.missedCount);
            if (address(reputation) != address(0)) {
                reputation.record(user, REP_MISSED, 0, false);
            }
        }
    }

    function lockCollateral(address user, uint128 amount) external onlyCreditModule {
        if (amount > available(user)) revert InsufficientAvailable();
        accounts[user].lockedCollateral += amount;
        emit CollateralLocked(user, amount);
    }

    function releaseCollateral(address user, uint128 amount) external onlyCreditModule {
        Account storage a = accounts[user];
        if (amount > a.lockedCollateral) revert InsufficientLocked();
        a.lockedCollateral -= amount;
        emit CollateralReleased(user, amount);
    }

    function seizeCollateral(address user, uint128 amount, address to)
        external
        onlyCreditModule
        nonReentrant
    {
        Account storage a = accounts[user];
        if (amount > a.lockedCollateral) revert InsufficientLocked();
        a.lockedCollateral -= amount;
        a.balance -= amount;
        _sendToken(to, amount);
        emit CollateralSeized(user, amount, to);
    }

    function pause() external onlyGuardian {
        paused = true;
        emit Paused(true);
    }

    function unpause() external onlyGuardian {
        paused = false;
        emit Paused(false);
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
