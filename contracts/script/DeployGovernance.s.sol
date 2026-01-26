// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.31;

import {Script, console} from "forge-std/Script.sol";
import {ERC1967Proxy} from "@luxfi/standard/proxy/Proxy.sol";

// Token contracts
import {CYRUS} from "../src/CYRUS.sol";
import {PARS} from "../src/PARS.sol";
import {vePARS} from "../src/vePARS.sol";
import {SafeDeployer} from "../src/SafeDeployer.sol";

// Governance contracts from @luxfi/standard
import {Governor} from "@luxfi/standard/governance/Governor.sol";
import {Strategy} from "@luxfi/standard/governance/Strategy.sol";
import {VoteTrackerLRC20} from "@luxfi/standard/governance/voting/VoteTrackerLRC20.sol";
import {IVotingTypes} from "@luxfi/standard/governance/interfaces/IVotingTypes.sol";

// CYRUS governance adapters
import {VotingWeightVePARS} from "../src/governance/VotingWeightVePARS.sol";
import {ProposerAdapterVePARS} from "../src/governance/ProposerAdapterVePARS.sol";

/**
 * @title DeployFullGovernance
 * @notice Full deployment of CYRUS ecosystem with governance on Base
 * @dev Deploy order:
 *      1. Deploy Safe infrastructure and create multisig
 *      2. Deploy token contracts (CYRUS, PARS, vePARS)
 *      3. Deploy governance adapters (VotingWeight, ProposerAdapter)
 *      4. Deploy VoteTracker
 *      5. Deploy Strategy (voting logic)
 *      6. Deploy Governor (proposal management)
 *      7. Enable Governor as Safe module
 */
contract DeployFullGovernance is Script {
    // ============ Deployed Contracts ============

    // Infrastructure
    SafeDeployer public safeDeployer;
    address public safe;

    // Tokens
    CYRUS public cyrus;
    PARS public pars;
    vePARS public vepars;

    // Governance
    VotingWeightVePARS public votingWeight;
    ProposerAdapterVePARS public proposerAdapter;
    VoteTrackerLRC20 public voteTracker;
    Strategy public strategy;
    Governor public governor;

    // ============ Configuration ============

    // Governance parameters
    uint32 constant VOTING_PERIOD = 3 days;
    uint32 constant TIMELOCK_PERIOD = 2 days;
    uint32 constant EXECUTION_PERIOD = 7 days;
    uint256 constant QUORUM_THRESHOLD = 100_000e6; // 100k vePARS
    uint256 constant BASIS_NUMERATOR = 500_000; // 50% approval required
    uint256 constant PROPOSER_THRESHOLD = 10_000e6; // 10k vePARS to propose

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        string memory ownersStr = vm.envOr("SAFE_OWNERS", string(""));
        address[] memory owners = _parseOwners(ownersStr, deployer);
        uint256 threshold = vm.envOr("SAFE_THRESHOLD", (owners.length / 2) + 1);

        console.log("=== Deploying CYRUS Full Governance ===");
        console.log("Deployer:", deployer);
        console.log("Safe owners:", owners.length);
        console.log("Safe threshold:", threshold);

        vm.startBroadcast(deployerPrivateKey);

        // ============ 1. Safe Infrastructure ============
        safeDeployer = new SafeDeployer();
        uint256 saltNonce = uint256(keccak256(abi.encodePacked("CYRUS-GOV", block.timestamp)));
        safe = safeDeployer.createSafe(owners, threshold, saltNonce);
        console.log("\n[1/7] Safe Multisig:", safe);

        // ============ 2. Token Contracts ============
        cyrus = new CYRUS(safe);
        console.log("[2/7] CYRUS:", address(cyrus));

        pars = new PARS(address(cyrus), safe, safe);
        console.log("      PARS:", address(pars));

        vepars = new vePARS(address(pars));
        console.log("      vePARS:", address(vepars));

        // ============ 3. Governance Adapters ============
        votingWeight = new VotingWeightVePARS(address(vepars), 1e18);
        console.log("[3/7] VotingWeightVePARS:", address(votingWeight));

        proposerAdapter = new ProposerAdapterVePARS(address(vepars), PROPOSER_THRESHOLD);
        console.log("      ProposerAdapterVePARS:", address(proposerAdapter));

        // ============ 4. Vote Tracker (Proxy) ============
        VoteTrackerLRC20 voteTrackerImpl = new VoteTrackerLRC20();
        bytes memory voteTrackerInit = abi.encodeCall(
            VoteTrackerLRC20.initialize,
            (new address[](0)) // Will authorize Strategy later
        );
        ERC1967Proxy voteTrackerProxy = new ERC1967Proxy(
            address(voteTrackerImpl),
            voteTrackerInit
        );
        voteTracker = VoteTrackerLRC20(address(voteTrackerProxy));
        console.log("[4/7] VoteTracker:", address(voteTracker));

        // ============ 5. Strategy (Proxy) ============
        Strategy strategyImpl = new Strategy();
        address[] memory proposerAdapters = new address[](1);
        proposerAdapters[0] = address(proposerAdapter);

        bytes memory strategyInit = abi.encodeCall(
            Strategy.initialize,
            (
                VOTING_PERIOD,
                QUORUM_THRESHOLD,
                BASIS_NUMERATOR,
                proposerAdapters,
                address(0) // No light account factory
            )
        );
        ERC1967Proxy strategyProxy = new ERC1967Proxy(
            address(strategyImpl),
            strategyInit
        );
        strategy = Strategy(address(strategyProxy));
        console.log("[5/7] Strategy:", address(strategy));

        // ============ 6. Governor (Proxy) ============
        Governor governorImpl = new Governor();
        bytes memory governorInit = abi.encodeCall(
            Governor.initialize,
            (
                safe,                    // owner
                safe,                    // vault (Safe)
                safe,                    // target (Safe)
                address(strategy),       // strategy
                TIMELOCK_PERIOD,         // timelock
                EXECUTION_PERIOD         // execution period
            )
        );
        ERC1967Proxy governorProxy = new ERC1967Proxy(
            address(governorImpl),
            governorInit
        );
        governor = Governor(address(governorProxy));
        console.log("[6/7] Governor:", address(governor));

        // ============ 7. Configure Strategy Phase 2 ============
        IVotingTypes.VotingConfig[] memory votingConfigs = new IVotingTypes.VotingConfig[](1);
        votingConfigs[0] = IVotingTypes.VotingConfig({
            votingWeight: address(votingWeight),
            voteTracker: address(voteTracker)
        });

        // Note: initialize2 must be called by owner (deployer initially, then Safe)
        // This is a limitation - we'd need to transfer ownership or use a different pattern
        // For now, strategy admin will be set during initialize2
        console.log("[7/7] Strategy.initialize2 needs to be called via Safe");
        console.log("      Call: Strategy.initialize2(governor, votingConfigs)");

        vm.stopBroadcast();

        _logSummary(owners, threshold);
    }

    function _parseOwners(string memory ownersStr, address deployer) internal pure returns (address[] memory) {
        if (bytes(ownersStr).length == 0) {
            address[] memory owners = new address[](1);
            owners[0] = deployer;
            return owners;
        }

        bytes memory strBytes = bytes(ownersStr);
        uint256 count = 1;
        for (uint256 i = 0; i < strBytes.length; i++) {
            if (strBytes[i] == ",") count++;
        }

        address[] memory owners = new address[](count);
        owners[0] = deployer;
        return owners;
    }

    function _logSummary(address[] memory owners, uint256 threshold) internal view {
        console.log("\n========================================");
        console.log("    CYRUS GOVERNANCE DEPLOYED");
        console.log("========================================");
        console.log("\n--- Safe Multisig ---");
        console.log("Address:", safe);
        console.log("Threshold:", threshold, "/", owners.length);
        console.log("\n--- Token Contracts ---");
        console.log("CYRUS:", address(cyrus));
        console.log("PARS:", address(pars));
        console.log("vePARS:", address(vepars));
        console.log("\n--- Governance Contracts ---");
        console.log("Governor:", address(governor));
        console.log("Strategy:", address(strategy));
        console.log("VoteTracker:", address(voteTracker));
        console.log("VotingWeight:", address(votingWeight));
        console.log("ProposerAdapter:", address(proposerAdapter));
        console.log("\n--- Parameters ---");
        console.log("Voting Period:", VOTING_PERIOD / 1 days, "days");
        console.log("Timelock:", TIMELOCK_PERIOD / 1 days, "days");
        console.log("Execution Window:", EXECUTION_PERIOD / 1 days, "days");
        console.log("Quorum:", QUORUM_THRESHOLD / 1e6, "vePARS");
        console.log("Approval:", BASIS_NUMERATOR / 10000, "%");
        console.log("Proposer Threshold:", PROPOSER_THRESHOLD / 1e6, "vePARS");
        console.log("\n========================================");
        console.log("          NEXT STEPS");
        console.log("========================================");
        console.log("1. Via Safe, call: Strategy.initialize2(Governor, votingConfigs)");
        console.log("2. Via Safe, call: Safe.enableModule(Governor)");
        console.log("3. Via Safe, call: PARS.setDemurrageExempt(vePARS, true)");
        console.log("4. Verify all contracts on Basescan");
        console.log("========================================\n");
    }
}
