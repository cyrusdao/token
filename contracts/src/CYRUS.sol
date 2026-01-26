// SPDX-License-Identifier: BSD-3-Clause
// Copyright (c) 2025 CYRUS Foundation
pragma solidity ^0.8.31;

import {ERC20} from "@luxfi/standard/tokens/ERC20.sol";
import {Ownable} from "@luxfi/standard/access/Access.sol";
import {AccessControl} from "@luxfi/standard/access/Access.sol";

/**
 * @title CYRUS - USD-Backed Stablecoin for Iranian Diaspora
 * @notice A stablecoin providing store of value for the Iranian diaspora community
 * @dev Based on LRC20B pattern from @luxfi/contracts
 *
 * CYRUS TOKENOMICS:
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │  CYRUS is a 1:1 USD-backed stablecoin designed for the Iranian diaspora    │
 * │                                                                             │
 * │  Properties:                                                                │
 * │  - Peg: 1 CYRUS = 1 USD                                                     │
 * │  - Backing: 100% USD reserves (audited)                                     │
 * │  - Network: Base (Ethereum L2)                                              │
 * │  - Governance: PARS token holders via Safe multisig                         │
 * │                                                                             │
 * │  Use Cases:                                                                 │
 * │  - Remittances to family in Iran                                            │
 * │  - Store of value vs. rial volatility                                       │
 * │  - Cross-border payments                                                    │
 * │  - DeFi integrations on Base                                                │
 * │                                                                             │
 * │  Admin Controls (Safe Multisig):                                            │
 * │  - Mint: Issue new CYRUS against USD deposits                               │
 * │  - Burn: Redeem CYRUS for USD                                               │
 * │  - Pause: Emergency freeze capability                                       │
 * │  - Blacklist: Compliance requirements                                       │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */
contract CYRUS is ERC20, Ownable, AccessControl {
    // ============ Roles ============

    /// @notice Admin role for governance operations
    bytes32 public constant ADMIN_ROLE = DEFAULT_ADMIN_ROLE;

    /// @notice Minter role for issuing new CYRUS
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    /// @notice Pauser role for emergency freeze
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    // ============ State ============

    /// @notice Whether transfers are paused
    bool public paused;

    /// @notice Blacklisted addresses (compliance)
    mapping(address => bool) public blacklisted;

    // ============ Events ============

    event Mint(address indexed to, uint256 amount);
    event Burn(address indexed from, uint256 amount);
    event Paused(bool status);
    event Blacklisted(address indexed account, bool status);
    event AdminGranted(address indexed to);
    event AdminRevoked(address indexed to);

    // ============ Errors ============

    error IsPaused();
    error IsBlacklisted();
    error ZeroAddress();
    error ZeroAmount();

    // ============ Constructor ============

    constructor(address admin) ERC20("CYRUS", "CYRUS") Ownable(admin) {
        if (admin == address(0)) revert ZeroAddress();

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);
        _grantRole(PAUSER_ROLE, admin);
    }

    // ============ Admin Functions ============

    /// @notice Grant admin role to address
    /// @param to Address to grant admin role
    function grantAdmin(address to) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(DEFAULT_ADMIN_ROLE, to);
        grantRole(MINTER_ROLE, to);
        emit AdminGranted(to);
    }

    /// @notice Revoke admin role from address
    /// @param to Address to revoke admin role from
    function revokeAdmin(address to) external onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(DEFAULT_ADMIN_ROLE, to);
        revokeRole(MINTER_ROLE, to);
        emit AdminRevoked(to);
    }

    // ============ Minting/Burning ============

    /// @notice Mint CYRUS (against USD deposit)
    /// @param to Recipient address
    /// @param amount Amount to mint
    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        if (to == address(0)) revert ZeroAddress();
        if (amount == 0) revert ZeroAmount();
        if (blacklisted[to]) revert IsBlacklisted();

        _mint(to, amount);
        emit Mint(to, amount);
    }

    /// @notice Burn CYRUS (for USD redemption)
    /// @param from Address to burn from
    /// @param amount Amount to burn
    function burn(address from, uint256 amount) external onlyRole(MINTER_ROLE) {
        if (amount == 0) revert ZeroAmount();

        _burn(from, amount);
        emit Burn(from, amount);
    }

    /// @notice User burns their own CYRUS
    /// @param amount Amount to burn
    function burnSelf(uint256 amount) external {
        if (amount == 0) revert ZeroAmount();

        _burn(msg.sender, amount);
        emit Burn(msg.sender, amount);
    }

    // ============ Pause/Blacklist ============

    /// @notice Pause all transfers
    /// @param _paused New pause status
    function setPaused(bool _paused) external onlyRole(PAUSER_ROLE) {
        paused = _paused;
        emit Paused(_paused);
    }

    /// @notice Blacklist address (compliance)
    /// @param account Address to blacklist
    /// @param status Blacklist status
    function setBlacklist(address account, bool status) external onlyRole(DEFAULT_ADMIN_ROLE) {
        blacklisted[account] = status;
        emit Blacklisted(account, status);
    }

    // ============ Overrides ============

    /// @dev Check pause and blacklist before transfers
    function _update(address from, address to, uint256 amount) internal virtual override {
        if (paused) revert IsPaused();
        if (blacklisted[from] || blacklisted[to]) revert IsBlacklisted();

        super._update(from, to, amount);
    }

    /// @notice Token decimals (6 for USD compatibility)
    function decimals() public pure override returns (uint8) {
        return 6;
    }
}
