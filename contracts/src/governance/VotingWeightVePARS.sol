// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.31;

import {IERC165} from "@luxfi/standard/utils/Utils.sol";
import {IVotingWeight} from "@luxfi/standard/governance/interfaces/IVotingWeight.sol";

/**
 * @title VotingWeightVePARS
 * @notice IVotingWeight adapter for vePARS voting power
 * @dev Uses vePARS balance as voting weight for CYRUS governance
 *
 * GOVERNANCE INTEGRATION:
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │                                                                             │
 * │   Strategy.sol                                                              │
 * │       ↓                                                                     │
 * │   VotingWeightVePARS.calculateWeight(voter, timestamp, voteData)           │
 * │       ↓                                                                     │
 * │   vePARS.balanceOf(voter)  ←── Time-weighted voting power                  │
 * │       ↓                                                                     │
 * │   weight = vePARS balance (already time-weighted in contract)              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * vePARS provides time-weighted voting power:
 * - Lock PARS for 1 week to 4 years
 * - Longer lock = more voting power
 * - Voting power decays linearly to 0 at unlock time
 */
contract VotingWeightVePARS is IVotingWeight, IERC165 {
    /// @notice vePARS token address
    address public immutable vePARS;

    /// @notice Weight multiplier (1e18 = 1x, 2e18 = 2x)
    uint256 public immutable weightMultiplier;

    // ============ Constructor ============

    /**
     * @param _vePARS Address of vePARS vote-escrowed token
     * @param _multiplier Weight multiplier (1e18 = 1x)
     */
    constructor(address _vePARS, uint256 _multiplier) {
        require(_vePARS != address(0), "Invalid address");
        require(_multiplier > 0, "Invalid multiplier");

        vePARS = _vePARS;
        weightMultiplier = _multiplier;
    }

    // ============ IVotingWeight Implementation ============

    /**
     * @notice Calculates voting weight for a voter
     * @param voter_ The address whose voting weight to calculate
     * @param timestamp_ The timestamp at which to calculate weight (for snapshot)
     * @param voteData_ Implementation-specific data (unused)
     * @return weight The calculated voting weight
     * @return processedData Empty bytes (no additional data needed)
     */
    function calculateWeight(
        address voter_,
        uint256 timestamp_,
        bytes calldata voteData_
    ) external view override returns (uint256 weight, bytes memory processedData) {
        // Silence unused parameter warnings
        timestamp_;
        voteData_;

        // Get vePARS voting power (already time-weighted)
        weight = _getVotingWeight(voter_);

        // Apply multiplier
        weight = (weight * weightMultiplier) / 1e18;

        // Return empty processed data
        processedData = "";
    }

    /**
     * @notice Calculates voting weight for paymaster validation (ERC-4337)
     * @dev Avoids using block.timestamp/block.number (banned opcodes for paymaster)
     * @param voter_ The address whose voting weight to calculate
     * @param timestamp_ The timestamp at which to calculate weight
     * @param voteData_ Implementation-specific data (unused)
     * @return weight The calculated voting weight
     */
    function getVotingWeightForPaymaster(
        address voter_,
        uint256 timestamp_,
        bytes calldata voteData_
    ) external view override returns (uint256 weight) {
        (weight, ) = this.calculateWeight(voter_, timestamp_, voteData_);
    }

    // ============ ERC165 ============

    function supportsInterface(bytes4 interfaceId) external pure override returns (bool) {
        return interfaceId == type(IVotingWeight).interfaceId ||
               interfaceId == type(IERC165).interfaceId;
    }

    // ============ View Functions ============

    /**
     * @notice Get voting power for an address
     * @param voter The address to query
     * @return votingPower The vePARS voting power
     */
    function getVotingPower(address voter) external view returns (uint256 votingPower) {
        votingPower = _getVotingWeight(voter);
        votingPower = (votingPower * weightMultiplier) / 1e18;
    }

    // ============ Internal ============

    /**
     * @dev Get voting weight from vePARS
     * @param voter Voter address
     * @return Voting weight
     */
    function _getVotingWeight(address voter) internal view returns (uint256) {
        // vePARS.balanceOf returns time-weighted voting power
        (bool success, bytes memory data) = vePARS.staticcall(
            abi.encodeWithSignature("balanceOf(address)", voter)
        );

        if (success && data.length >= 32) {
            return abi.decode(data, (uint256));
        }

        return 0;
    }
}
