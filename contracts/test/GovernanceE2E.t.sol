// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.31;

import {Test, console} from "forge-std/Test.sol";
import {ERC1967Proxy} from "@luxfi/standard/proxy/Proxy.sol";

// Token contracts
import {CYRUS} from "../src/CYRUS.sol";
import {PARS} from "../src/PARS.sol";
import {vePARS} from "../src/vePARS.sol";
import {SafeDeployer} from "../src/SafeDeployer.sol";
import {Safe, Enum as SafeEnum, IModuleManager} from "@luxfi/standard/safe/Safe.sol";
import {Enum} from "@luxfi/standard/governance/base/Enum.sol";

// Governance contracts from @luxfi/standard
import {Governor} from "@luxfi/standard/governance/Governor.sol";
import {Strategy} from "@luxfi/standard/governance/Strategy.sol";
import {IStrategy} from "@luxfi/standard/governance/interfaces/IStrategy.sol";
import {VoteTrackerLRC20} from "@luxfi/standard/governance/voting/VoteTrackerLRC20.sol";
import {IVotingTypes} from "@luxfi/standard/governance/interfaces/IVotingTypes.sol";
import {Transaction} from "@luxfi/standard/governance/base/Transaction.sol";

// CYRUS governance adapters
import {VotingWeightVePARS} from "../src/governance/VotingWeightVePARS.sol";
import {ProposerAdapterVePARS} from "../src/governance/ProposerAdapterVePARS.sol";

/**
 * @title GovernanceE2E
 * @notice End-to-end tests for CYRUS governance system
 * @dev Tests full lifecycle: deploy -> lock -> propose -> vote -> execute
 */
contract GovernanceE2E is Test {
    // ============ Contracts ============
    SafeDeployer public safeDeployer;
    Safe public safe;
    CYRUS public cyrus;
    PARS public pars;
    vePARS public vepars;
    VotingWeightVePARS public votingWeight;
    ProposerAdapterVePARS public proposerAdapter;
    VoteTrackerLRC20 public voteTracker;
    Strategy public strategy;
    Governor public governor;

    // ============ Actors ============
    address public admin;
    address public voter1;
    address public voter2;
    address public voter3;
    address public nonVoter;

    uint256 constant ADMIN_PK = 0xAD;
    uint256 constant VOTER1_PK = 0x1111;
    uint256 constant VOTER2_PK = 0x2222;
    uint256 constant VOTER3_PK = 0x3333;
    uint256 constant NONVOTER_PK = 0x4444;

    // ============ Governance Parameters ============
    uint32 constant VOTING_PERIOD = 1 hours;
    uint32 constant TIMELOCK_PERIOD = 10 minutes;
    uint32 constant EXECUTION_PERIOD = 1 days;
    uint256 constant QUORUM_THRESHOLD = 1000e6; // 1k vePARS
    uint256 constant BASIS_NUMERATOR = 500_000; // 50% approval
    uint256 constant PROPOSER_THRESHOLD = 100e6; // 100 vePARS to propose

    function setUp() public {
        // Derive addresses from private keys
        admin = vm.addr(ADMIN_PK);
        voter1 = vm.addr(VOTER1_PK);
        voter2 = vm.addr(VOTER2_PK);
        voter3 = vm.addr(VOTER3_PK);
        nonVoter = vm.addr(NONVOTER_PK);

        // Fund accounts
        vm.deal(admin, 100 ether);
        vm.deal(voter1, 100 ether);
        vm.deal(voter2, 100 ether);
        vm.deal(voter3, 100 ether);

        _deployFullEcosystem();
    }

    function _deployFullEcosystem() internal {
        vm.startPrank(admin);

        // 1. Deploy Safe infrastructure
        safeDeployer = new SafeDeployer();
        address[] memory owners = new address[](1);
        owners[0] = admin;
        address safeAddr = safeDeployer.createSafe(owners, 1, block.timestamp);
        safe = Safe(payable(safeAddr));

        // 2. Deploy tokens (admin controls for testing)
        cyrus = new CYRUS(admin);
        pars = new PARS(address(cyrus), admin, admin);
        vepars = new vePARS(address(pars));

        // Exempt vePARS from demurrage
        pars.setDemurrageExempt(address(vepars), true);

        // Grant Safe the MINTER_ROLE so governance can mint CYRUS
        cyrus.grantRole(cyrus.MINTER_ROLE(), address(safe));

        // 3. Deploy governance adapters
        votingWeight = new VotingWeightVePARS(address(vepars), 1e18);
        proposerAdapter = new ProposerAdapterVePARS(address(vepars), PROPOSER_THRESHOLD);

        // 4. Deploy Strategy (proxy) FIRST to get its address
        Strategy strategyImpl = new Strategy();
        address[] memory proposerAdapters = new address[](1);
        proposerAdapters[0] = address(proposerAdapter);

        bytes memory strategyInit = abi.encodeCall(
            Strategy.initialize,
            (VOTING_PERIOD, QUORUM_THRESHOLD, BASIS_NUMERATOR, proposerAdapters, address(0))
        );
        ERC1967Proxy strategyProxy = new ERC1967Proxy(address(strategyImpl), strategyInit);
        strategy = Strategy(address(strategyProxy));

        // 5. Deploy VoteTracker with Strategy as authorized caller
        VoteTrackerLRC20 voteTrackerImpl = new VoteTrackerLRC20();
        address[] memory authorizedCallers = new address[](1);
        authorizedCallers[0] = address(strategy);
        bytes memory voteTrackerInit = abi.encodeCall(
            VoteTrackerLRC20.initialize,
            (authorizedCallers)
        );
        ERC1967Proxy voteTrackerProxy = new ERC1967Proxy(address(voteTrackerImpl), voteTrackerInit);
        voteTracker = VoteTrackerLRC20(address(voteTrackerProxy));

        // 6. Deploy Governor (proxy)
        Governor governorImpl = new Governor();
        bytes memory governorInit = abi.encodeCall(
            Governor.initialize,
            (admin, address(safe), address(safe), address(strategy), TIMELOCK_PERIOD, EXECUTION_PERIOD)
        );
        ERC1967Proxy governorProxy = new ERC1967Proxy(address(governorImpl), governorInit);
        governor = Governor(address(governorProxy));

        // 7. Configure Strategy phase 2
        IVotingTypes.VotingConfig[] memory votingConfigs = new IVotingTypes.VotingConfig[](1);
        votingConfigs[0] = IVotingTypes.VotingConfig({
            votingWeight: address(votingWeight),
            voteTracker: address(voteTracker)
        });
        strategy.initialize2(address(governor), votingConfigs);

        // 8. Enable Governor as Safe module
        bytes memory enableModuleData = abi.encodeCall(IModuleManager.enableModule, (address(governor)));
        _execSafeTransaction(address(safe), enableModuleData);

        vm.stopPrank();
    }

    // ============ E2E Test: Full Governance Lifecycle ============

    function test_E2E_FullGovernanceCycle() public {
        console.log("\n=== E2E: Full Governance Cycle ===\n");

        // Step 1: Setup voters with vePARS
        console.log("Step 1: Setting up voters with vePARS locks...");
        _setupVoterWithVePARS(voter1, 2000e6, 1460 days); // 2000 PARS, 4 year lock
        _setupVoterWithVePARS(voter2, 1500e6, 1460 days); // 1500 PARS, 4 year lock
        _setupVoterWithVePARS(voter3, 500e6, 1460 days);  // 500 PARS, 4 year lock

        uint256 power1 = votingWeight.getVotingPower(voter1);
        uint256 power2 = votingWeight.getVotingPower(voter2);
        uint256 power3 = votingWeight.getVotingPower(voter3);
        console.log("  Voter1 power:", power1);
        console.log("  Voter2 power:", power2);
        console.log("  Voter3 power:", power3);
        console.log("  Total power:", power1 + power2 + power3);

        // Step 2: Create proposal (mint CYRUS to treasury)
        console.log("\nStep 2: Creating proposal...");

        Transaction[] memory txs = new Transaction[](1);
        txs[0] = Transaction({
            to: address(cyrus),
            value: 0,
            data: abi.encodeCall(CYRUS.mint, (address(safe), 1_000_000e6)),
            operation: Enum.Operation.Call
        });

        vm.prank(voter1);
        governor.submitProposal(
            txs,
            "Mint 1M CYRUS to treasury",
            address(proposerAdapter),
            ""
        );

        uint32 proposalId = 0; // First proposal (0-indexed)
        console.log("  Proposal created: ID", proposalId);

        // Step 3: Vote on proposal
        console.log("\nStep 3: Voting on proposal...");

        // Prepare vote data
        IVotingTypes.VotingConfigVoteData[] memory voteData = new IVotingTypes.VotingConfigVoteData[](1);
        voteData[0] = IVotingTypes.VotingConfigVoteData({
            configIndex: 0,
            voteData: ""
        });

        vm.prank(voter1);
        strategy.castVote(proposalId, uint8(IStrategy.VoteType.YES), voteData, 0);
        console.log("  Voter1 voted: YES");

        vm.prank(voter2);
        strategy.castVote(proposalId, uint8(IStrategy.VoteType.YES), voteData, 0);
        console.log("  Voter2 voted: YES");

        vm.prank(voter3);
        strategy.castVote(proposalId, uint8(IStrategy.VoteType.NO), voteData, 0);
        console.log("  Voter3 voted: NO");

        // Step 4: End voting period
        console.log("\nStep 4: Ending voting period...");
        vm.warp(block.timestamp + VOTING_PERIOD + 1);

        // Check if proposal passed
        bool passed = strategy.isPassed(proposalId);
        console.log("  Proposal passed:", passed);
        assertTrue(passed, "Proposal should pass");

        // Step 5: Wait for timelock
        console.log("\nStep 5: Waiting for timelock period...");
        vm.warp(block.timestamp + TIMELOCK_PERIOD + 1);
        console.log("  Timelock period passed");

        // Step 6: Execute proposal
        console.log("\nStep 6: Executing proposal...");
        uint256 treasuryBalanceBefore = cyrus.balanceOf(address(safe));

        governor.executeProposal(proposalId, txs);

        uint256 treasuryBalanceAfter = cyrus.balanceOf(address(safe));
        console.log("  Treasury balance before:", treasuryBalanceBefore);
        console.log("  Treasury balance after:", treasuryBalanceAfter);

        assertEq(treasuryBalanceAfter - treasuryBalanceBefore, 1_000_000e6, "Treasury should receive 1M CYRUS");

        console.log("\n=== E2E Test PASSED ===\n");
    }

    // ============ E2E Test: Proposal Rejected by Voters ============

    function test_E2E_ProposalRejectedByVoters() public {
        console.log("\n=== E2E: Proposal Rejected by Voters ===\n");

        // Setup voters with enough for quorum
        _setupVoterWithVePARS(voter1, 1000e6, 1460 days);
        _setupVoterWithVePARS(voter2, 2000e6, 1460 days);

        // Create proposal
        Transaction[] memory txs = new Transaction[](1);
        txs[0] = Transaction({
            to: address(cyrus),
            value: 0,
            data: abi.encodeCall(CYRUS.mint, (voter1, 100_000_000e6)), // Absurd amount
            operation: Enum.Operation.Call
        });

        vm.prank(voter1);
        governor.submitProposal(txs, "Mint absurd amount", address(proposerAdapter), "");

        uint32 proposalId = 0;

        // Vote
        IVotingTypes.VotingConfigVoteData[] memory voteData = new IVotingTypes.VotingConfigVoteData[](1);
        voteData[0] = IVotingTypes.VotingConfigVoteData({configIndex: 0, voteData: ""});

        vm.prank(voter1);
        strategy.castVote(proposalId, uint8(IStrategy.VoteType.YES), voteData, 0); // Proposer votes YES

        vm.prank(voter2);
        strategy.castVote(proposalId, uint8(IStrategy.VoteType.NO), voteData, 0); // Larger voter votes NO

        // End voting
        vm.warp(block.timestamp + VOTING_PERIOD + 1);

        bool passed = strategy.isPassed(proposalId);
        assertFalse(passed, "Proposal should not pass");

        console.log("Proposal correctly rejected by voters");
    }

    // ============ E2E Test: Multi-Action Proposal ============

    function test_E2E_MultiActionProposal() public {
        console.log("\n=== E2E: Multi-Action Proposal ===\n");

        // Setup voters
        _setupVoterWithVePARS(voter1, 2000e6, 1460 days);
        _setupVoterWithVePARS(voter2, 1500e6, 1460 days);

        // Create multi-action proposal
        Transaction[] memory txs = new Transaction[](2);
        txs[0] = Transaction({
            to: address(cyrus),
            value: 0,
            data: abi.encodeCall(CYRUS.mint, (address(safe), 500_000e6)),
            operation: Enum.Operation.Call
        });
        txs[1] = Transaction({
            to: address(cyrus),
            value: 0,
            data: abi.encodeCall(CYRUS.mint, (voter1, 100_000e6)),
            operation: Enum.Operation.Call
        });

        vm.prank(voter1);
        governor.submitProposal(txs, "Multi-mint proposal", address(proposerAdapter), "");

        uint32 proposalId = 0;

        // Vote
        IVotingTypes.VotingConfigVoteData[] memory voteData = new IVotingTypes.VotingConfigVoteData[](1);
        voteData[0] = IVotingTypes.VotingConfigVoteData({configIndex: 0, voteData: ""});

        vm.prank(voter1);
        strategy.castVote(proposalId, uint8(IStrategy.VoteType.YES), voteData, 0);
        vm.prank(voter2);
        strategy.castVote(proposalId, uint8(IStrategy.VoteType.YES), voteData, 0);

        // Execute
        vm.warp(block.timestamp + VOTING_PERIOD + TIMELOCK_PERIOD + 2);

        uint256 safeBefore = cyrus.balanceOf(address(safe));
        uint256 voter1Before = cyrus.balanceOf(voter1);

        governor.executeProposal(proposalId, txs);

        uint256 safeAfter = cyrus.balanceOf(address(safe));
        uint256 voter1After = cyrus.balanceOf(voter1);

        assertEq(safeAfter - safeBefore, 500_000e6, "Safe should receive 500k CYRUS");
        assertEq(voter1After - voter1Before, 100_000e6, "Voter1 should receive 100k CYRUS");

        console.log("Multi-action proposal executed successfully");
    }

    // ============ E2E Test: Cannot Propose Without Threshold ============

    function test_E2E_CannotProposeWithoutThreshold() public {
        console.log("\n=== E2E: Cannot Propose Without Threshold ===\n");

        // Verify proposer threshold
        bool canPropose = proposerAdapter.isProposer(nonVoter, "");
        assertFalse(canPropose, "NonVoter should not be able to propose");

        // Try to create proposal
        Transaction[] memory txs = new Transaction[](1);
        txs[0] = Transaction({
            to: address(cyrus),
            value: 0,
            data: abi.encodeCall(CYRUS.mint, (nonVoter, 1e6)),
            operation: Enum.Operation.Call
        });

        vm.prank(nonVoter);
        vm.expectRevert();
        governor.submitProposal(txs, "Unauthorized proposal", address(proposerAdapter), "");

        console.log("Non-proposer correctly rejected");
    }

    // ============ E2E Test: Voting Power Affects Outcome ============

    function test_E2E_VotingPowerAffectsOutcome() public {
        console.log("\n=== E2E: Voting Power Affects Outcome ===\n");

        // Setup voters with different power levels
        // voter1: small stake, voter2: large stake
        _setupVoterWithVePARS(voter1, 500e6, 1460 days);  // ~500 voting power
        _setupVoterWithVePARS(voter2, 3000e6, 1460 days); // ~3000 voting power

        uint256 power1 = votingWeight.getVotingPower(voter1);
        uint256 power2 = votingWeight.getVotingPower(voter2);
        console.log("  Voter1 power:", power1);
        console.log("  Voter2 power:", power2);

        // Create proposal
        Transaction[] memory txs = new Transaction[](1);
        txs[0] = Transaction({
            to: address(cyrus),
            value: 0,
            data: abi.encodeCall(CYRUS.mint, (address(safe), 100e6)),
            operation: Enum.Operation.Call
        });

        vm.prank(voter1);
        governor.submitProposal(txs, "Test voting power", address(proposerAdapter), "");

        uint32 proposalId = 0;

        IVotingTypes.VotingConfigVoteData[] memory voteData = new IVotingTypes.VotingConfigVoteData[](1);
        voteData[0] = IVotingTypes.VotingConfigVoteData({configIndex: 0, voteData: ""});

        // voter1 votes YES, voter2 votes NO
        // Despite voter1 proposing and voting YES, voter2's larger stake should win
        vm.prank(voter1);
        strategy.castVote(proposalId, uint8(IStrategy.VoteType.YES), voteData, 0);

        vm.prank(voter2);
        strategy.castVote(proposalId, uint8(IStrategy.VoteType.NO), voteData, 0);

        vm.warp(block.timestamp + VOTING_PERIOD + 1);

        bool passed = strategy.isPassed(proposalId);
        assertFalse(passed, "Proposal should fail - NO votes outweigh YES");

        console.log("Larger voter's NO correctly defeated smaller voter's YES");
    }

    // ============ Helper Functions ============

    function _setupVoterWithVePARS(address voter, uint256 amount, uint256 lockDuration) internal {
        // Mint CYRUS
        vm.prank(admin);
        cyrus.mint(voter, amount);

        // Stake for PARS and lock in vePARS
        vm.startPrank(voter);
        cyrus.approve(address(pars), amount);
        pars.stake(amount, PARS.Tier.Mehr);
        pars.approve(address(vepars), amount);
        vepars.createLock(amount, block.timestamp + lockDuration);
        vm.stopPrank();
    }

    function _execSafeTransaction(address to, bytes memory data) internal {
        bytes memory sig = abi.encodePacked(uint256(uint160(admin)), bytes32(0), uint8(1));
        safe.execTransaction(
            to, 0, data, SafeEnum.Operation.Call,
            0, 0, 0, address(0), payable(0), sig
        );
    }
}
