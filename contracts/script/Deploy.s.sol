// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.31;

import {Script, console} from "forge-std/Script.sol";
import {CYRUS} from "../src/CYRUS.sol";
import {PARS} from "../src/PARS.sol";
import {vePARS} from "../src/vePARS.sol";
import {SafeDeployer} from "../src/SafeDeployer.sol";

/**
 * @title DeployCYRUSWithSafe
 * @notice Full deployment of CYRUS ecosystem with Safe multisig on Base
 * @dev Deploy order:
 *      1. Deploy Safe infrastructure (singleton, factory, etc.)
 *      2. Create Safe multisig with initial owners
 *      3. Deploy CYRUS stablecoin (admin = Safe)
 *      4. Deploy PARS governance token (treasury = Safe)
 *      5. Deploy vePARS vote escrow
 *      6. Configure roles and permissions
 */
contract DeployCYRUSWithSafe is Script {
    // Deployed contracts
    SafeDeployer public safeDeployer;
    address public safe;
    CYRUS public cyrus;
    PARS public pars;
    vePARS public vepars;

    function run() external {
        // Load config from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        // Load multisig owners from env (comma-separated)
        // Example: SAFE_OWNERS=0x123...,0x456...,0x789...
        string memory ownersStr = vm.envString("SAFE_OWNERS");
        address[] memory owners = _parseOwners(ownersStr, deployer);

        // Threshold (default: majority)
        uint256 threshold = vm.envOr("SAFE_THRESHOLD", (owners.length / 2) + 1);

        console.log("=== Deploying CYRUS Ecosystem to Base ===");
        console.log("Deployer:", deployer);
        console.log("Safe owners:", owners.length);
        console.log("Safe threshold:", threshold);

        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy Safe infrastructure
        safeDeployer = new SafeDeployer();
        console.log("\n[1/6] SafeDeployer:", address(safeDeployer));

        (
            address singleton,
            address factory,
            address handler,
            address multi,
            address multiCallOnly
        ) = safeDeployer.getInfrastructure();
        console.log("  - Singleton (SafeL2):", singleton);
        console.log("  - Factory:", factory);
        console.log("  - FallbackHandler:", handler);
        console.log("  - MultiSend:", multi);
        console.log("  - MultiSendCallOnly:", multiCallOnly);

        // 2. Create Safe multisig
        uint256 saltNonce = uint256(keccak256(abi.encodePacked("CYRUS", block.timestamp)));
        safe = safeDeployer.createSafe(owners, threshold, saltNonce);
        console.log("\n[2/6] Safe Multisig:", safe);

        // 3. Deploy CYRUS stablecoin (admin = Safe)
        cyrus = new CYRUS(safe);
        console.log("[3/6] CYRUS:", address(cyrus));

        // 4. Deploy PARS governance token (treasury = Safe, admin = Safe)
        pars = new PARS(address(cyrus), safe, safe);
        console.log("[4/6] PARS:", address(pars));

        // 5. Deploy vePARS vote escrow
        vepars = new vePARS(address(pars));
        console.log("[5/6] vePARS:", address(vepars));

        // 6. Note: demurrage exemption for vePARS needs to be done via Safe
        // This will be the first governance action
        console.log("[6/6] Note: Execute via Safe to exempt vePARS from demurrage");
        console.log("  Call: PARS.setDemurrageExempt(vePARS, true)");

        vm.stopBroadcast();

        // Log deployment summary
        _logSummary(owners, threshold);
    }

    function _parseOwners(string memory ownersStr, address deployer) internal pure returns (address[] memory) {
        // If no owners specified, use deployer as sole owner
        if (bytes(ownersStr).length == 0) {
            address[] memory owners = new address[](1);
            owners[0] = deployer;
            return owners;
        }

        // Count commas to determine array size
        bytes memory strBytes = bytes(ownersStr);
        uint256 count = 1;
        for (uint256 i = 0; i < strBytes.length; i++) {
            if (strBytes[i] == ",") count++;
        }

        // Parse addresses (simplified - in production use proper parsing)
        address[] memory owners = new address[](count);
        // For now, just use deployer - in real deployment, parse the string
        owners[0] = deployer;

        return owners;
    }

    function _logSummary(address[] memory owners, uint256 threshold) internal view {
        console.log("\n========================================");
        console.log("       CYRUS ECOSYSTEM DEPLOYED");
        console.log("========================================");
        console.log("\nNetwork: Base");
        console.log("\n--- Safe Multisig ---");
        console.log("Address:", safe);
        console.log("Threshold:", threshold, "/", owners.length);
        console.log("\n--- Token Contracts ---");
        console.log("CYRUS (Stablecoin):", address(cyrus));
        console.log("PARS (Governance):", address(pars));
        console.log("vePARS (Vote Escrow):", address(vepars));
        console.log("\n--- Safe Infrastructure ---");
        console.log("SafeDeployer:", address(safeDeployer));
        console.log("\n========================================");
        console.log("          NEXT STEPS");
        console.log("========================================");
        console.log("1. Verify contracts on Basescan");
        console.log("2. Via Safe, call: PARS.setDemurrageExempt(vePARS, true)");
        console.log("3. Via Safe, mint initial CYRUS supply");
        console.log("4. Set up governance frontend");
        console.log("========================================\n");
    }
}

/**
 * @title DeployCYRUSTestnet
 * @notice Deployment script for Base Sepolia testnet
 */
contract DeployCYRUSTestnet is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        console.log("Deploying to Base Sepolia testnet...");
        console.log("Deployer:", deployer);

        vm.startBroadcast(deployerPrivateKey);

        // Deploy Safe infrastructure
        SafeDeployer safeDeployer = new SafeDeployer();
        console.log("SafeDeployer:", address(safeDeployer));

        // Create Safe with deployer as sole owner (for testing)
        address[] memory owners = new address[](1);
        owners[0] = deployer;
        address safe = safeDeployer.createSafe(owners, 1, block.timestamp);
        console.log("Safe:", safe);

        // Deploy tokens with deployer as admin (for easier testing)
        CYRUS cyrus = new CYRUS(deployer);
        console.log("CYRUS:", address(cyrus));

        PARS pars = new PARS(address(cyrus), deployer, deployer);
        console.log("PARS:", address(pars));

        vePARS vepars = new vePARS(address(pars));
        console.log("vePARS:", address(vepars));

        // Exempt vePARS from demurrage
        pars.setDemurrageExempt(address(vepars), true);

        // Mint some test CYRUS
        cyrus.mint(deployer, 1_000_000e6); // 1M CYRUS
        console.log("Minted 1M CYRUS to deployer");

        vm.stopBroadcast();

        console.log("\n=== Testnet Deployment Complete ===");
        console.log("Safe:", safe);
        console.log("CYRUS:", address(cyrus));
        console.log("PARS:", address(pars));
        console.log("vePARS:", address(vepars));
    }
}

/**
 * @title DeploySafeOnly
 * @notice Deploy only Safe infrastructure (for upgrading existing deployments)
 */
contract DeploySafeOnly is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        console.log("Deploying Safe infrastructure only...");
        console.log("Deployer:", deployer);

        vm.startBroadcast(deployerPrivateKey);

        SafeDeployer safeDeployer = new SafeDeployer();

        (
            address singleton,
            address factory,
            address handler,
            address multi,
            address multiCallOnly
        ) = safeDeployer.getInfrastructure();

        vm.stopBroadcast();

        console.log("\n=== Safe Infrastructure ===");
        console.log("SafeDeployer:", address(safeDeployer));
        console.log("Singleton (SafeL2):", singleton);
        console.log("Factory:", factory);
        console.log("FallbackHandler:", handler);
        console.log("MultiSend:", multi);
        console.log("MultiSendCallOnly:", multiCallOnly);
    }
}
