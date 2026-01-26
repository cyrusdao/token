// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity ^0.8.31;

// All Safe contracts from @luxfi/standard
import {Safe, SafeL2, SafeProxy, SafeProxyFactory} from "@luxfi/standard/safe/Safe.sol";
import {CompatibilityFallbackHandler} from "@luxfi/standard/safe/Safe.sol";
import {MultiSend, MultiSendCallOnly} from "@luxfi/standard/safe/Safe.sol";

/**
 * @title SafeDeployer
 * @notice Deploys Safe infrastructure and creates multisig wallets
 * @dev Uses Safe Global v1.5.0 contracts
 *
 * DEPLOYMENT:
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │  1. Deploy SafeL2 singleton (implementation for L2 chains like Base)        │
 * │  2. Deploy SafeProxyFactory                                                 │
 * │  3. Deploy CompatibilityFallbackHandler                                     │
 * │  4. Deploy MultiSend and MultiSendCallOnly                                  │
 * │  5. Create Safe proxy with initial owners                                   │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */
contract SafeDeployer {
    // ============ Deployed Infrastructure ============

    /// @notice Safe singleton (implementation) - use SafeL2 for L2 chains
    SafeL2 public safeSingleton;

    /// @notice Factory for creating Safe proxies
    SafeProxyFactory public safeProxyFactory;

    /// @notice Fallback handler for EIP-1271 signatures and other compatibility
    CompatibilityFallbackHandler public fallbackHandler;

    /// @notice MultiSend for batched transactions
    MultiSend public multiSend;

    /// @notice MultiSendCallOnly for batched view calls
    MultiSendCallOnly public multiSendCallOnly;

    // ============ Events ============

    event InfrastructureDeployed(
        address indexed singleton,
        address indexed factory,
        address indexed fallbackHandler,
        address multiSend,
        address multiSendCallOnly
    );

    event SafeCreated(
        address indexed safe,
        address[] owners,
        uint256 threshold
    );

    // ============ Constructor ============

    /// @notice Deploy all Safe infrastructure
    constructor() {
        // Deploy Safe singleton (L2 version for Base)
        safeSingleton = new SafeL2();

        // Deploy factory
        safeProxyFactory = new SafeProxyFactory();

        // Deploy fallback handler
        fallbackHandler = new CompatibilityFallbackHandler();

        // Deploy MultiSend contracts
        multiSend = new MultiSend();
        multiSendCallOnly = new MultiSendCallOnly();

        emit InfrastructureDeployed(
            address(safeSingleton),
            address(safeProxyFactory),
            address(fallbackHandler),
            address(multiSend),
            address(multiSendCallOnly)
        );
    }

    // ============ Safe Creation ============

    /**
     * @notice Create a new Safe multisig wallet
     * @param owners Array of owner addresses
     * @param threshold Number of required confirmations
     * @param saltNonce Salt for deterministic address generation
     * @return safe Address of the created Safe
     */
    function createSafe(
        address[] memory owners,
        uint256 threshold,
        uint256 saltNonce
    ) external returns (address safe) {
        require(owners.length > 0, "No owners");
        require(threshold > 0 && threshold <= owners.length, "Invalid threshold");

        // Encode initializer data for Safe.setup()
        bytes memory initializer = abi.encodeCall(
            Safe.setup,
            (
                owners,                           // _owners
                threshold,                        // _threshold
                address(0),                       // to (no delegate call)
                "",                               // data
                address(fallbackHandler),         // fallbackHandler
                address(0),                       // paymentToken (ETH)
                0,                                // payment
                payable(address(0))               // paymentReceiver
            )
        );

        // Create proxy with initializer
        SafeProxy proxy = safeProxyFactory.createProxyWithNonce(
            address(safeSingleton),
            initializer,
            saltNonce
        );

        safe = address(proxy);

        emit SafeCreated(safe, owners, threshold);
    }

    /**
     * @notice Compute the address of a Safe before deployment
     * @param owners Array of owner addresses
     * @param threshold Number of required confirmations
     * @param saltNonce Salt for deterministic address generation
     * @return predicted Predicted Safe address
     */
    function computeSafeAddress(
        address[] memory owners,
        uint256 threshold,
        uint256 saltNonce
    ) external view returns (address predicted) {
        bytes memory initializer = abi.encodeCall(
            Safe.setup,
            (
                owners,
                threshold,
                address(0),
                "",
                address(fallbackHandler),
                address(0),
                0,
                payable(address(0))
            )
        );

        bytes32 salt = keccak256(abi.encodePacked(keccak256(initializer), saltNonce));

        bytes memory proxyCreationCode = safeProxyFactory.proxyCreationCode();
        bytes memory deploymentData = abi.encodePacked(
            proxyCreationCode,
            uint256(uint160(address(safeSingleton)))
        );

        predicted = address(
            uint160(
                uint256(
                    keccak256(
                        abi.encodePacked(
                            bytes1(0xff),
                            address(safeProxyFactory),
                            salt,
                            keccak256(deploymentData)
                        )
                    )
                )
            )
        );
    }

    // ============ View Functions ============

    /// @notice Get all deployed infrastructure addresses
    function getInfrastructure() external view returns (
        address singleton,
        address factory,
        address handler,
        address multi,
        address multiCallOnly
    ) {
        return (
            address(safeSingleton),
            address(safeProxyFactory),
            address(fallbackHandler),
            address(multiSend),
            address(multiSendCallOnly)
        );
    }
}
