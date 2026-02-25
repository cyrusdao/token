// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.31;

import {Test, console} from "forge-std/Test.sol";

// Token contracts
import {CYRUS} from "../src/CYRUS.sol";
import {PARS} from "../src/PARS.sol";
import {vePARS} from "../src/vePARS.sol";

// Governance adapters
import {VotingWeightVePARS} from "../src/governance/VotingWeightVePARS.sol";
import {ProposerAdapterVePARS} from "../src/governance/ProposerAdapterVePARS.sol";

contract GovernanceTest is Test {
    CYRUS public cyrus;
    PARS public pars;
    vePARS public vepars;
    VotingWeightVePARS public votingWeight;
    ProposerAdapterVePARS public proposerAdapter;

    address public admin = address(0xAD);
    address public treasury = address(0xFE);
    address public voter1;
    address public voter2;
    address public voter3;

    uint256 constant VOTER1_PK = 0x1111;
    uint256 constant VOTER2_PK = 0x2222;
    uint256 constant VOTER3_PK = 0x3333;

    function setUp() public {
        // Derive voter addresses from private keys
        voter1 = vm.addr(VOTER1_PK);
        voter2 = vm.addr(VOTER2_PK);
        voter3 = vm.addr(VOTER3_PK);

        vm.startPrank(admin);

        // Deploy token contracts
        cyrus = new CYRUS(admin);
        pars = new PARS(address(cyrus), treasury, admin);
        vepars = new vePARS(address(pars));

        // Exempt vePARS from demurrage
        pars.setDemurrageExempt(address(vepars), true);

        // Deploy governance adapters
        votingWeight = new VotingWeightVePARS(address(vepars), 1e18);
        proposerAdapter = new ProposerAdapterVePARS(address(vepars), 100e6); // 100 vePARS to propose

        vm.stopPrank();
    }

    // ============ VotingWeightVePARS Tests ============

    function test_VotingWeightWithNoLock() public view {
        (uint256 weight, ) = votingWeight.calculateWeight(voter1, block.timestamp, "");
        assertEq(weight, 0, "Should have no voting weight without vePARS lock");
    }

    function test_VotingWeightWithLock() public {
        // Setup: Give voter1 some PARS and lock in vePARS
        _setupVoterWithVePARS(voter1, 1000e6, 365 days);

        // Check voting weight
        uint256 votingPower = votingWeight.getVotingPower(voter1);
        assertTrue(votingPower > 0, "Should have voting power");
        assertTrue(votingPower < 1000e6, "Voting power should be less than locked amount");
    }

    function test_VotingWeightDecaysOverTime() public {
        // Setup: Give voter1 some PARS and lock in vePARS
        _setupVoterWithVePARS(voter1, 1000e6, 365 days);

        uint256 initialPower = votingWeight.getVotingPower(voter1);

        // Warp forward 180 days
        vm.warp(block.timestamp + 180 days);

        uint256 laterPower = votingWeight.getVotingPower(voter1);

        assertTrue(laterPower < initialPower, "Voting power should decay over time");
    }

    function test_VotingWeightSupportsInterface() public view {
        // Check ERC165 support
        assertTrue(votingWeight.supportsInterface(0x01ffc9a7), "Should support ERC165");
    }

    // ============ ProposerAdapterVePARS Tests ============

    function test_ProposerWithNoVePARS() public view {
        bool canPropose = proposerAdapter.isProposer(voter1, "");
        assertFalse(canPropose, "Should not be able to propose without vePARS");
    }

    function test_ProposerWithInsufficientVePARS() public {
        // Setup: Give voter1 less than proposer threshold (100 vePARS)
        // Note: PARS.Tier.Mehr minimum is 100e6, so we stake 100e6 but short lock gives less voting power
        _setupVoterWithVePARS(voter1, 100e6, 2 weeks);

        // Short lock means voting power is very low
        uint256 votingPower = votingWeight.getVotingPower(voter1);

        // With 2 week lock out of 4 year max, voting power will be ~100e6 * (2/208) = ~1e6
        // Proposer threshold is 100e6, so this should fail
        bool canPropose = proposerAdapter.isProposer(voter1, "");
        assertFalse(canPropose, "Should not be able to propose with insufficient vePARS");
    }

    function test_ProposerWithSufficientVePARS() public {
        // Setup: Give voter1 more than threshold (100 vePARS)
        // Lock for 4 years to get maximum voting power (1:1)
        _setupVoterWithVePARS(voter1, 500e6, 1460 days);

        uint256 votingPower = votingWeight.getVotingPower(voter1);
        console.log("Voting power:", votingPower);

        // With 4 year lock, voting power should be close to locked amount
        bool canPropose = proposerAdapter.isProposer(voter1, "");
        assertTrue(canPropose, "Should be able to propose with sufficient vePARS");
    }

    function test_ProposerSupportsInterface() public view {
        assertTrue(proposerAdapter.supportsInterface(0x01ffc9a7), "Should support ERC165");
    }

    // ============ Integration Tests ============

    function test_MultipleVotersWithDifferentPower() public {
        // Setup different lock amounts and durations
        _setupVoterWithVePARS(voter1, 1000e6, 365 days);  // 1000 PARS for 1 year
        _setupVoterWithVePARS(voter2, 1000e6, 730 days);  // 1000 PARS for 2 years
        _setupVoterWithVePARS(voter3, 500e6, 1460 days);  // 500 PARS for 4 years

        uint256 power1 = votingWeight.getVotingPower(voter1);
        uint256 power2 = votingWeight.getVotingPower(voter2);
        uint256 power3 = votingWeight.getVotingPower(voter3);

        // Voter2 has same amount but longer lock -> more power
        assertTrue(power2 > power1, "Longer lock should give more voting power");

        // All should be able to propose (threshold is 100 vePARS)
        assertTrue(proposerAdapter.isProposer(voter1, ""), "Voter1 should be able to propose");
        assertTrue(proposerAdapter.isProposer(voter2, ""), "Voter2 should be able to propose");
        assertTrue(proposerAdapter.isProposer(voter3, ""), "Voter3 should be able to propose");
    }

    function test_VotingPowerAfterUnlock() public {
        // Setup: Create a short lock
        _setupVoterWithVePARS(voter1, 1000e6, 2 weeks);

        uint256 initialPower = votingWeight.getVotingPower(voter1);
        assertTrue(initialPower > 0, "Should have initial voting power");

        // Warp past unlock time
        vm.warp(block.timestamp + 3 weeks);

        uint256 finalPower = votingWeight.getVotingPower(voter1);
        assertEq(finalPower, 0, "Should have no voting power after unlock");
    }

    // ============ Helper Functions ============

    function _setupVoterWithVePARS(address voter, uint256 amount, uint256 lockDuration) internal {
        // Mint CYRUS to voter
        vm.prank(admin);
        cyrus.mint(voter, amount);

        // Stake CYRUS for PARS
        vm.startPrank(voter);
        cyrus.approve(address(pars), amount);
        pars.stake(amount, PARS.Tier.Mehr);

        // Lock PARS in vePARS
        pars.approve(address(vepars), amount);
        vepars.createLock(amount, block.timestamp + lockDuration);
        vm.stopPrank();
    }
}
