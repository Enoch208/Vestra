// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {SavingsVault} from "../src/SavingsVault.sol";
import {CreditModule} from "../src/CreditModule.sol";
import {REP_REPAYMENT, REP_DEFAULT} from "../src/interfaces/IReputationSink.sol";
import {MockERC20} from "./mocks/MockERC20.sol";
import {MockReputation} from "./mocks/MockReputation.sol";

contract CreditModuleTest is Test {
    SavingsVault vault;
    CreditModule credit;
    MockERC20 token;
    MockReputation rep;

    address agent = address(0xA1);
    address guardian = address(0x6A);
    address user = address(0xBEEF);

    uint64 constant DAILY = 0.1 ether;
    uint256 constant HARD_CAP = 50 ether;
    uint256 constant SAVINGS = 10 ether;

    function setUp() public {
        vm.warp(1_700_000_000);
        token = new MockERC20();
        rep = new MockReputation();
        vault = new SavingsVault(address(token), agent, guardian);
        credit = new CreditModule(address(vault), guardian, HARD_CAP);

        vm.startPrank(guardian);
        vault.setCreditModule(address(credit));
        credit.setReputation(address(rep));
        vm.stopPrank();

        vm.prank(agent);
        vault.setVerified(user, true);
        vm.prank(user);
        vault.openAccount(DAILY);

        token.mint(user, 100 ether);
        token.mint(address(credit), 100 ether);

        vm.startPrank(user);
        token.approve(address(vault), type(uint256).max);
        token.approve(address(credit), type(uint256).max);
        vault.deposit(SAVINGS);
        vm.stopPrank();
    }

    function test_EligibleAmountCappedBySavings() public view {
        assertEq(credit.eligibleAmount(user), SAVINGS, "min(available, cap)");
    }

    function test_EligibleAmountCappedByHardCap() public {
        vm.prank(user);
        vault.deposit(50 ether);
        assertGt(vault.available(user), HARD_CAP, "available exceeds cap");
        assertEq(credit.eligibleAmount(user), HARD_CAP, "hard cap applies");
    }

    function test_RequestAdvanceLocksCollateralAndPays() public {
        uint256 userBefore = token.balanceOf(user);

        vm.prank(user);
        credit.requestAdvance(4 ether);

        (uint128 principal, uint128 outstanding, uint128 collateral,, CreditModule.Status status) =
            credit.advances(user);
        assertEq(principal, 4 ether);
        assertEq(outstanding, 4 ether);
        assertEq(collateral, 4 ether, "100% collateral");
        assertEq(uint8(status), uint8(CreditModule.Status.Active));

        assertEq(token.balanceOf(user), userBefore + 4 ether, "principal disbursed");
        assertEq(vault.available(user), SAVINGS - 4 ether, "collateral locked");
        assertEq(credit.eligibleAmount(user), 0, "no new advance while active");
    }

    function test_RequestAdvanceExceedingEligibleReverts() public {
        vm.prank(user);
        vm.expectRevert(CreditModule.ExceedsEligible.selector);
        credit.requestAdvance(uint128(SAVINGS + 1));
    }

    function test_SecondActiveAdvanceReverts() public {
        vm.startPrank(user);
        credit.requestAdvance(2 ether);
        vm.expectRevert(CreditModule.ActiveAdvanceExists.selector);
        credit.requestAdvance(1 ether);
        vm.stopPrank();
    }

    function test_PartialThenFullRepayReleasesCollateral() public {
        vm.startPrank(user);
        credit.requestAdvance(4 ether);

        credit.repay(1 ether);
        (, uint128 outstanding,,,) = credit.advances(user);
        assertEq(outstanding, 3 ether, "partial repay");
        assertEq(vault.available(user), SAVINGS - 4 ether, "still locked");

        credit.repay(3 ether);
        vm.stopPrank();

        (, uint128 out2,,, CreditModule.Status status) = credit.advances(user);
        assertEq(out2, 0, "fully repaid");
        assertEq(uint8(status), uint8(CreditModule.Status.Repaid));
        assertEq(vault.available(user), SAVINGS, "collateral released");
        assertEq(rep.lastKind(), REP_REPAYMENT, "reputation = repayment");
    }

    function test_OverpaymentCapsAtOutstanding() public {
        vm.startPrank(user);
        credit.requestAdvance(2 ether);
        uint256 balBefore = token.balanceOf(user);
        credit.repay(100 ether);
        vm.stopPrank();

        (, uint128 outstanding,,, CreditModule.Status status) = credit.advances(user);
        assertEq(outstanding, 0);
        assertEq(uint8(status), uint8(CreditModule.Status.Repaid));
        assertEq(token.balanceOf(user), balBefore - 2 ether, "only outstanding pulled");
    }

    function test_HandleDefaultBeforeDueReverts() public {
        vm.prank(user);
        credit.requestAdvance(4 ether);

        vm.expectRevert(CreditModule.NotDue.selector);
        credit.handleDefault(user);
    }

    function test_HandleDefaultSeizesCollateral() public {
        vm.prank(user);
        credit.requestAdvance(4 ether);

        vm.warp(block.timestamp + 31 days);
        uint256 creditBefore = token.balanceOf(address(credit));

        credit.handleDefault(user);

        (, uint128 outstanding,,, CreditModule.Status status) = credit.advances(user);
        assertEq(outstanding, 0, "outstanding covered by collateral");
        assertEq(uint8(status), uint8(CreditModule.Status.Defaulted));
        assertEq(token.balanceOf(address(credit)), creditBefore + 4 ether, "collateral seized to module");
        assertEq(vault.available(user), SAVINGS - 4 ether, "seized funds left the vault balance");
        assertEq(rep.lastKind(), REP_DEFAULT, "reputation = default");
    }

    function test_DefaultSeizureBoundedByOutstanding() public {
        vm.startPrank(user);
        credit.requestAdvance(4 ether);
        credit.repay(3 ether);
        vm.stopPrank();

        vm.warp(block.timestamp + 31 days);
        credit.handleDefault(user);

        (, uint128 outstanding, uint128 collateral,,) = credit.advances(user);
        assertEq(outstanding, 0, "remaining 1 ether seized");
        assertEq(collateral, 4 ether, "original collateral record unchanged");
        assertEq(vault.available(user), SAVINGS - 1 ether, "only outstanding seized, 3 released");
    }
}
