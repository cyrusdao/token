// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.31;

import {Test, console} from "forge-std/Test.sol";
import {SafeDeployer} from "../src/SafeDeployer.sol";
import {CYRUS} from "../src/CYRUS.sol";
import {PARS} from "../src/PARS.sol";
import {vePARS} from "../src/vePARS.sol";
import {Safe, Enum} from "@luxfi/standard/safe/Safe.sol";

contract SafeDeployerTest is Test {
    SafeDeployer public deployer;
    address public safe;

    // Use vm.addr() to derive proper addresses from private keys
    // Note: address(0x1) is the sentinel address used by Safe's linked list
    address public owner1;
    address public owner2;
    address public owner3;

    uint256 public constant OWNER1_PK = 0xA11CE;
    uint256 public constant OWNER2_PK = 0xB0B;
    uint256 public constant OWNER3_PK = 0xCAFE;

    function setUp() public {
        // Derive owner addresses from private keys
        owner1 = vm.addr(OWNER1_PK);
        owner2 = vm.addr(OWNER2_PK);
        owner3 = vm.addr(OWNER3_PK);

        // Deploy Safe infrastructure
        deployer = new SafeDeployer();

        // Create a 2-of-3 Safe
        address[] memory owners = new address[](3);
        owners[0] = owner1;
        owners[1] = owner2;
        owners[2] = owner3;

        safe = deployer.createSafe(owners, 2, 12345);
    }

    function test_SafeInfrastructureDeployed() public view {
        (
            address singleton,
            address factory,
            address handler,
            address multi,
            address multiCallOnly
        ) = deployer.getInfrastructure();

        assertTrue(singleton != address(0), "Singleton not deployed");
        assertTrue(factory != address(0), "Factory not deployed");
        assertTrue(handler != address(0), "Handler not deployed");
        assertTrue(multi != address(0), "MultiSend not deployed");
        assertTrue(multiCallOnly != address(0), "MultiSendCallOnly not deployed");
    }

    function test_SafeCreated() public view {
        assertTrue(safe != address(0), "Safe not created");

        // Check Safe properties
        Safe safeContract = Safe(payable(safe));
        assertEq(safeContract.getThreshold(), 2, "Threshold should be 2");

        address[] memory owners = safeContract.getOwners();
        assertEq(owners.length, 3, "Should have 3 owners");
    }

    function test_SafeOwners() public view {
        Safe safeContract = Safe(payable(safe));

        assertTrue(safeContract.isOwner(owner1), "Owner1 should be owner");
        assertTrue(safeContract.isOwner(owner2), "Owner2 should be owner");
        assertTrue(safeContract.isOwner(owner3), "Owner3 should be owner");
        assertFalse(safeContract.isOwner(address(0x999)), "Random address should not be owner");
    }

    function test_ComputeSafeAddress() public view {
        address[] memory owners = new address[](2);
        owners[0] = vm.addr(0xDEAD);
        owners[1] = vm.addr(0xBEEF);

        address predicted = deployer.computeSafeAddress(owners, 1, 99999);
        assertTrue(predicted != address(0), "Should compute address");
    }

    function test_MultipleSafesWithDifferentSalts() public {
        address[] memory owners = new address[](1);
        owners[0] = vm.addr(0xFACE);

        address safe1 = deployer.createSafe(owners, 1, 1);
        address safe2 = deployer.createSafe(owners, 1, 2);

        assertTrue(safe1 != safe2, "Different salts should produce different addresses");
    }

    function test_SafeAsAdminForCYRUS() public {
        // Deploy CYRUS with Safe as admin
        CYRUS cyrus = new CYRUS(safe);

        // Safe should have admin role
        assertTrue(cyrus.hasRole(cyrus.DEFAULT_ADMIN_ROLE(), safe), "Safe should be admin");
        assertTrue(cyrus.hasRole(cyrus.MINTER_ROLE(), safe), "Safe should be minter");
    }

    function test_FullEcosystemWithSafe() public {
        // Deploy full ecosystem with Safe as admin
        CYRUS cyrus = new CYRUS(safe);
        PARS pars = new PARS(address(cyrus), safe, safe);
        vePARS vepars = new vePARS(address(pars));

        // Verify Safe is admin/treasury for all
        assertTrue(cyrus.hasRole(cyrus.DEFAULT_ADMIN_ROLE(), safe), "Safe should be CYRUS admin");
        assertTrue(pars.hasRole(pars.GOVERNOR_ROLE(), safe), "Safe should be PARS governor");
        assertEq(pars.treasury(), safe, "Safe should be PARS treasury");

        // vePARS should work with PARS
        assertEq(address(vepars.pars()), address(pars), "vePARS should reference PARS");
    }

    function test_SafeCanExecuteTransaction() public {
        // Deploy CYRUS with Safe as admin
        CYRUS cyrus = new CYRUS(safe);

        // Prepare transaction data to mint CYRUS
        bytes memory data = abi.encodeCall(cyrus.mint, (address(0x999), 1000e6));

        // Get Safe contract
        Safe safeContract = Safe(payable(safe));

        // Create transaction hash
        bytes32 txHash = safeContract.getTransactionHash(
            address(cyrus),     // to
            0,                  // value
            data,               // data
            Enum.Operation.Call, // operation
            0,                  // safeTxGas
            0,                  // baseGas
            0,                  // gasPrice
            address(0),         // gasToken
            payable(address(0)), // refundReceiver
            safeContract.nonce() // nonce
        );

        // Sign with owner1
        (uint8 v1, bytes32 r1, bytes32 s1) = vm.sign(OWNER1_PK, txHash);

        // Sign with owner2
        (uint8 v2, bytes32 r2, bytes32 s2) = vm.sign(OWNER2_PK, txHash);

        // Combine signatures (sorted by owner address)
        bytes memory signatures;
        if (owner1 < owner2) {
            signatures = abi.encodePacked(r1, s1, v1, r2, s2, v2);
        } else {
            signatures = abi.encodePacked(r2, s2, v2, r1, s1, v1);
        }

        // Execute transaction
        bool success = safeContract.execTransaction(
            address(cyrus),
            0,
            data,
            Enum.Operation.Call,
            0,
            0,
            0,
            address(0),
            payable(address(0)),
            signatures
        );

        assertTrue(success, "Transaction should succeed");
        assertEq(cyrus.balanceOf(address(0x999)), 1000e6, "Should have minted CYRUS");
    }
}
