// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.31;

import {Test, console} from "forge-std/Test.sol";
import {CYRUS} from "../src/CYRUS.sol";
import {PARS} from "../src/PARS.sol";
import {vePARS} from "../src/vePARS.sol";

contract CYRUSTest is Test {
    CYRUS public cyrus;
    PARS public pars;
    vePARS public vepars;

    address public admin = address(0x1);
    address public treasury = address(0x2);
    address public user1 = address(0x3);
    address public user2 = address(0x4);

    function setUp() public {
        vm.startPrank(admin);

        // Deploy contracts
        cyrus = new CYRUS(admin);
        pars = new PARS(address(cyrus), treasury, admin);
        vepars = new vePARS(address(pars));

        // Exempt vePARS from demurrage (protocol contract holding user funds)
        pars.setDemurrageExempt(address(vepars), true);

        vm.stopPrank();
    }

    // ============ CYRUS Tests ============

    function test_CYRUSMetadata() public view {
        assertEq(cyrus.name(), "CYRUS");
        assertEq(cyrus.symbol(), "CYRUS");
        assertEq(cyrus.decimals(), 6);
    }

    function test_CYRUSMint() public {
        vm.prank(admin);
        cyrus.mint(user1, 1000e6);

        assertEq(cyrus.balanceOf(user1), 1000e6);
    }

    function test_CYRUSBurn() public {
        vm.startPrank(admin);
        cyrus.mint(user1, 1000e6);
        cyrus.burn(user1, 500e6);
        vm.stopPrank();

        assertEq(cyrus.balanceOf(user1), 500e6);
    }

    function test_CYRUSPause() public {
        vm.startPrank(admin);
        cyrus.mint(user1, 1000e6);
        cyrus.setPaused(true);
        vm.stopPrank();

        vm.prank(user1);
        vm.expectRevert(CYRUS.IsPaused.selector);
        cyrus.transfer(user2, 100e6);
    }

    function test_CYRUSBlacklist() public {
        vm.startPrank(admin);
        cyrus.mint(user1, 1000e6);
        cyrus.setBlacklist(user1, true);
        vm.stopPrank();

        vm.prank(user1);
        vm.expectRevert(CYRUS.IsBlacklisted.selector);
        cyrus.transfer(user2, 100e6);
    }

    // ============ PARS Tests ============

    function test_PARSMetadata() public view {
        assertEq(pars.name(), "PARS Governance");
        assertEq(pars.symbol(), "PARS");
        assertEq(pars.decimals(), 6);
    }

    function test_PARSStake() public {
        // Mint CYRUS to user
        vm.prank(admin);
        cyrus.mint(user1, 1000e6);

        // Approve and stake
        vm.startPrank(user1);
        cyrus.approve(address(pars), 1000e6);
        pars.stake(1000e6, PARS.Tier.Zarrin);
        vm.stopPrank();

        // Check balances
        assertEq(pars.balanceOf(user1), 1000e6);
        assertEq(cyrus.balanceOf(user1), 0);
        assertEq(pars.totalStaked(), 1000e6);

        // Check tier
        (PARS.Tier tier, uint256 boost) = pars.tierOf(user1);
        assertEq(uint256(tier), uint256(PARS.Tier.Zarrin));
        assertEq(boost, 11000); // 1.1x
    }

    function test_PARSUnstake() public {
        // Setup: Mint and stake
        vm.prank(admin);
        cyrus.mint(user1, 1000e6);

        vm.startPrank(user1);
        cyrus.approve(address(pars), 1000e6);
        pars.stake(1000e6, PARS.Tier.Mehr); // No lock
        vm.stopPrank();

        // Unstake
        vm.prank(user1);
        pars.unstake(500e6);

        assertEq(pars.balanceOf(user1), 500e6);
        assertEq(cyrus.balanceOf(user1), 500e6);
    }

    function test_PARSRebase() public {
        // Setup: Mint and stake
        vm.prank(admin);
        cyrus.mint(user1, 10000e6);

        vm.startPrank(user1);
        cyrus.approve(address(pars), 10000e6);
        pars.stake(10000e6, PARS.Tier.Azadi);
        vm.stopPrank();

        // Fast forward 1 epoch (8 hours)
        vm.warp(block.timestamp + 8 hours);

        // Trigger rebase
        pars.rebase();

        // Check pending rebase
        uint256 pending = pars.pendingRebase(user1);
        assertTrue(pending > 0, "Should have pending rebase");

        // Claim rebase
        vm.prank(user1);
        uint256 claimed = pars.claimRebase();
        assertTrue(claimed > 0, "Should claim rebase");
    }

    // ============ vePARS Tests ============

    function test_vePARSMetadata() public view {
        assertEq(vepars.name(), "Vote-Escrowed PARS");
        assertEq(vepars.symbol(), "vePARS");
        assertEq(vepars.decimals(), 6);
    }

    function test_vePARSLock() public {
        // Setup: Get PARS
        vm.prank(admin);
        cyrus.mint(user1, 1000e6);

        vm.startPrank(user1);
        cyrus.approve(address(pars), 1000e6);
        pars.stake(1000e6, PARS.Tier.Mehr);

        // Lock PARS in vePARS
        pars.approve(address(vepars), 1000e6);
        vepars.createLock(1000e6, block.timestamp + 365 days);
        vm.stopPrank();

        // Check lock
        (uint256 amount, uint256 end) = vepars.getLocked(user1);
        assertEq(amount, 1000e6);
        assertTrue(end > block.timestamp);

        // Check voting power
        uint256 votingPower = vepars.balanceOf(user1);
        assertTrue(votingPower > 0, "Should have voting power");
        assertTrue(votingPower < 1000e6, "Voting power should be less than locked amount");
    }

    function test_vePARSWithdraw() public {
        // Setup: Create lock
        vm.prank(admin);
        cyrus.mint(user1, 1000e6);

        vm.startPrank(user1);
        cyrus.approve(address(pars), 1000e6);
        pars.stake(1000e6, PARS.Tier.Mehr);
        pars.approve(address(vepars), 1000e6);
        // Lock for 2 weeks (rounded to week, must be > MIN_LOCK_TIME from now)
        vepars.createLock(1000e6, block.timestamp + 2 weeks);
        vm.stopPrank();

        // Try to withdraw before lock expires
        vm.prank(user1);
        vm.expectRevert(vePARS.LockNotExpired.selector);
        vepars.withdraw();

        // Fast forward past lock
        vm.warp(block.timestamp + 2 weeks + 1 days);

        // Withdraw - vePARS is exempt from demurrage so user gets full amount back
        vm.prank(user1);
        vepars.withdraw();

        // User should get back full PARS amount (vePARS is demurrage exempt)
        assertEq(pars.balanceOf(user1), 1000e6, "Should have full PARS balance");
        assertEq(vepars.balanceOf(user1), 0, "vePARS balance should be 0");

        // Verify the lock was cleared
        (uint256 lockedAmount, ) = vepars.getLocked(user1);
        assertEq(lockedAmount, 0, "Lock should be cleared");
    }
}
