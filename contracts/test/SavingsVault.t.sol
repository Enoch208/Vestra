// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {SavingsVault} from "../src/SavingsVault.sol";
import {REP_CONTRIBUTION, REP_MISSED} from "../src/interfaces/IReputationSink.sol";
import {MockERC20} from "./mocks/MockERC20.sol";
import {MockReputation} from "./mocks/MockReputation.sol";

contract SavingsVaultTest is Test {
    SavingsVault vault;
    MockERC20 token;
    MockReputation rep;

    address agent = address(0xA1);
    address guardian = address(0x6A);
    address creditModule = address(0xCD);
    address user = address(0xBEEF);

    uint64 constant DAILY = 0.1 ether;

    function setUp() public {
        vm.warp(1_700_000_000);
        token = new MockERC20();
        rep = new MockReputation();
        vault = new SavingsVault(address(token), agent, guardian);

        vm.startPrank(guardian);
        vault.setCreditModule(creditModule);
        vault.setReputation(address(rep));
        vm.stopPrank();

        vm.prank(agent);
        vault.setVerified(user, true);

        vm.prank(user);
        vault.openAccount(DAILY);

        token.mint(user, 100 ether);
        vm.prank(user);
        token.approve(address(vault), type(uint256).max);
    }

    function test_OpenAccountRequiresVerification() public {
        address stranger = address(0x1234);
        vm.prank(stranger);
        vm.expectRevert(SavingsVault.NotVerified.selector);
        vault.openAccount(DAILY);
    }

    function test_PullContributionHappyPath() public {
        vm.prank(agent);
        vault.pullContribution(user);

        (uint128 balance,,,, uint32 streak,, bool active) = vault.accounts(user);
        assertEq(balance, DAILY, "balance credited");
        assertEq(streak, 1, "streak incremented");
        assertTrue(active);
        assertEq(token.balanceOf(address(vault)), DAILY, "vault holds funds");
        assertEq(rep.count(), 1, "reputation written");
        assertEq(rep.lastKind(), REP_CONTRIBUTION, "kind = contribution");
    }

    function test_DoublePullSameWindowReverts() public {
        vm.prank(agent);
        vault.pullContribution(user);

        vm.prank(agent);
        vm.expectRevert(SavingsVault.WindowNotOpen.selector);
        vault.pullContribution(user);
    }

    function test_PullNextDayIncrementsStreak() public {
        vm.prank(agent);
        vault.pullContribution(user);

        vm.warp(block.timestamp + 1 days);
        vm.prank(agent);
        vault.pullContribution(user);

        (uint128 balance,,,, uint32 streak,,) = vault.accounts(user);
        assertEq(streak, 2, "streak = 2");
        assertEq(balance, uint128(DAILY) * 2, "two contributions");
    }

    function test_MissedWhenAllowanceRevoked() public {
        vm.prank(user);
        token.approve(address(vault), 0);

        vm.prank(agent);
        vault.pullContribution(user);

        (uint128 balance,,,, uint32 streak, uint32 missed,) = vault.accounts(user);
        assertEq(balance, 0, "no funds pulled");
        assertEq(streak, 0, "streak reset");
        assertEq(missed, 1, "missed counted");
        assertEq(rep.lastKind(), REP_MISSED, "kind = missed");
    }

    function test_StreakResetsAfterMiss() public {
        vm.prank(agent);
        vault.pullContribution(user);

        vm.warp(block.timestamp + 1 days);
        vm.prank(user);
        token.approve(address(vault), 0);
        vm.prank(agent);
        vault.pullContribution(user);

        (,,,, uint32 streak,,) = vault.accounts(user);
        assertEq(streak, 0, "streak reset after miss");
    }

    function test_OnlyAgentCanPull() public {
        vm.prank(user);
        vm.expectRevert(SavingsVault.NotAgent.selector);
        vault.pullContribution(user);
    }

    function test_WithdrawOnlyUnlocked() public {
        vm.prank(agent);
        vault.pullContribution(user);

        vm.prank(creditModule);
        vault.lockCollateral(user, uint128(DAILY));

        vm.prank(user);
        vm.expectRevert(SavingsVault.InsufficientAvailable.selector);
        vault.withdraw(1);
    }

    function test_DepositAndWithdraw() public {
        vm.prank(user);
        vault.deposit(5 ether);
        assertEq(vault.available(user), 5 ether);

        vm.prank(user);
        vault.withdraw(2 ether);
        assertEq(vault.available(user), 3 ether);
        assertEq(token.balanceOf(user), 100 ether - 5 ether + 2 ether);
    }

    function test_BalanceNeverBelowLocked() public {
        vm.prank(user);
        vault.deposit(10 ether);

        vm.prank(creditModule);
        vault.lockCollateral(user, 10 ether);

        (uint128 balance, uint128 locked,,,,,) = vault.accounts(user);
        assertGe(balance, locked, "invariant balance >= locked");

        vm.prank(creditModule);
        vm.expectRevert(SavingsVault.InsufficientAvailable.selector);
        vault.lockCollateral(user, 1);
    }

    function test_PausedBlocksPull() public {
        vm.prank(guardian);
        vault.pause();

        vm.prank(agent);
        vm.expectRevert(SavingsVault.IsPaused.selector);
        vault.pullContribution(user);
    }

    function test_OnlyCreditModuleLocks() public {
        vm.prank(agent);
        vm.expectRevert(SavingsVault.NotCreditModule.selector);
        vault.lockCollateral(user, 1);
    }
}
