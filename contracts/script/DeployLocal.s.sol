// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.31;

import {Script, console} from "forge-std/Script.sol";
import {ERC1967Proxy} from "@luxfi/standard/proxy/Proxy.sol";

import {CYRUS} from "../src/CYRUS.sol";
import {PARS} from "../src/PARS.sol";
import {vePARS} from "../src/vePARS.sol";
import {SafeDeployer} from "../src/SafeDeployer.sol";
import {Safe, Enum, IModuleManager} from "@luxfi/standard/safe/Safe.sol";

import {Governor} from "@luxfi/standard/governance/Governor.sol";
import {Strategy} from "@luxfi/standard/governance/Strategy.sol";
import {VoteTrackerLRC20} from "@luxfi/standard/governance/voting/VoteTrackerLRC20.sol";
import {IVotingTypes} from "@luxfi/standard/governance/interfaces/IVotingTypes.sol";

import {VotingWeightVePARS} from "../src/governance/VotingWeightVePARS.sol";
import {ProposerAdapterVePARS} from "../src/governance/ProposerAdapterVePARS.sol";

/**
 * @title DeployLocal
 * @notice Full deployment for local Anvil testing
 */
contract DeployLocal is Script {
    // Anvil default account 0
    uint256 constant DEPLOYER_PK = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;

    // Governance parameters (shorter for testing)
    uint32 constant VOTING_PERIOD = 1 hours;
    uint32 constant TIMELOCK_PERIOD = 10 minutes;
    uint32 constant EXECUTION_PERIOD = 1 days;
    uint256 constant QUORUM_THRESHOLD = 1000e6;
    uint256 constant BASIS_NUMERATOR = 500_000;
    uint256 constant PROPOSER_THRESHOLD = 100e6;

    function run() external {
        address deployer = vm.addr(DEPLOYER_PK);
        console.log("=== Local Deployment (Anvil) ===");
        console.log("Deployer:", deployer);

        vm.startBroadcast(DEPLOYER_PK);

        // Deploy in phases to avoid stack depth issues
        (address safe, address cyrusAddr, address pars, address vepars) = _deployTokens(deployer);
        (address strategy, address voteTracker, address votingWeight) = _deployGovernanceCore(vepars);
        address governor = _deployGovernor(deployer, safe, strategy, voteTracker);
        _configureAndFinalize(safe, governor, strategy, voteTracker, votingWeight, cyrusAddr, deployer);

        vm.stopBroadcast();

        console.log("\n=== Deployment Complete ===");
    }

    function _deployTokens(address deployer) internal returns (address safe, address cyrus, address pars, address vepars) {
        SafeDeployer safeDeployer = new SafeDeployer();
        address[] memory owners = new address[](1);
        owners[0] = deployer;
        safe = safeDeployer.createSafe(owners, 1, block.timestamp);
        console.log("Safe:", safe);

        CYRUS cyrusContract = new CYRUS(deployer);
        cyrus = address(cyrusContract);
        console.log("CYRUS:", cyrus);

        PARS parsContract = new PARS(cyrus, deployer, deployer);
        pars = address(parsContract);
        console.log("PARS:", pars);

        vePARS veparsContract = new vePARS(pars);
        vepars = address(veparsContract);
        console.log("vePARS:", vepars);

        parsContract.setDemurrageExempt(vepars, true);
        cyrusContract.grantRole(cyrusContract.MINTER_ROLE(), safe);
    }

    function _deployGovernanceCore(address vepars) internal returns (address strategy, address voteTracker, address votingWeightAddr) {
        VotingWeightVePARS votingWeight = new VotingWeightVePARS(vepars, 1e18);
        votingWeightAddr = address(votingWeight);
        console.log("VotingWeight:", votingWeightAddr);

        ProposerAdapterVePARS proposerAdapter = new ProposerAdapterVePARS(vepars, PROPOSER_THRESHOLD);
        console.log("ProposerAdapter:", address(proposerAdapter));

        // Deploy Strategy first
        Strategy strategyImpl = new Strategy();
        address[] memory proposerAdapters = new address[](1);
        proposerAdapters[0] = address(proposerAdapter);

        bytes memory strategyInit = abi.encodeCall(
            Strategy.initialize,
            (VOTING_PERIOD, QUORUM_THRESHOLD, BASIS_NUMERATOR, proposerAdapters, address(0))
        );
        ERC1967Proxy strategyProxy = new ERC1967Proxy(address(strategyImpl), strategyInit);
        strategy = address(strategyProxy);
        console.log("Strategy:", strategy);

        // Deploy VoteTracker with Strategy as authorized
        VoteTrackerLRC20 voteTrackerImpl = new VoteTrackerLRC20();
        address[] memory authorizedCallers = new address[](1);
        authorizedCallers[0] = strategy;
        bytes memory voteTrackerInit = abi.encodeCall(VoteTrackerLRC20.initialize, (authorizedCallers));
        ERC1967Proxy voteTrackerProxy = new ERC1967Proxy(address(voteTrackerImpl), voteTrackerInit);
        voteTracker = address(voteTrackerProxy);
        console.log("VoteTracker:", voteTracker);
    }

    function _deployGovernor(address deployer, address safe, address strategy, address voteTracker) internal returns (address governor) {
        Governor governorImpl = new Governor();
        bytes memory governorInit = abi.encodeCall(
            Governor.initialize,
            (deployer, safe, safe, strategy, TIMELOCK_PERIOD, EXECUTION_PERIOD)
        );
        ERC1967Proxy governorProxy = new ERC1967Proxy(address(governorImpl), governorInit);
        governor = address(governorProxy);
        console.log("Governor:", governor);
    }

    function _configureAndFinalize(
        address safe,
        address governor,
        address strategy,
        address voteTracker,
        address votingWeight,
        address cyrus,
        address deployer
    ) internal {
        // Configure Strategy phase 2 - use separate scope
        {
            IVotingTypes.VotingConfig[] memory votingConfigs = new IVotingTypes.VotingConfig[](1);
            votingConfigs[0] = IVotingTypes.VotingConfig({
                votingWeight: votingWeight,
                voteTracker: voteTracker
            });
            Strategy(strategy).initialize2(governor, votingConfigs);
            console.log("Strategy.initialize2 complete");
        }

        // Enable Governor as Safe module
        {
            bytes memory enableModuleData = abi.encodeCall(IModuleManager.enableModule, (governor));
            bytes memory sig = abi.encodePacked(uint256(uint160(deployer)), bytes32(0), uint8(1));
            Safe(payable(safe)).execTransaction(
                safe, 0, enableModuleData, Enum.Operation.Call,
                0, 0, 0, address(0), payable(0), sig
            );
            console.log("Governor enabled as Safe module");
        }

        // Mint test tokens
        CYRUS(cyrus).mint(deployer, 10_000_000e6);
        console.log("Minted 10M CYRUS to deployer");
    }

}
