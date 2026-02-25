// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.31;

import {IProposerAdapter} from "@luxfi/standard/governance/interfaces/IProposerAdapter.sol";
import {ERC165} from "@luxfi/standard/utils/Utils.sol";

/**
 * @title ProposerAdapterVePARS
 * @notice Proposer eligibility based on vePARS voting power
 * @dev Determines who can create proposals based on vePARS balance
 *
 * Features:
 * - Uses vePARS.balanceOf() for voting power (already time-weighted)
 * - Configurable threshold for proposal creation
 * - Zero threshold allows anyone with vePARS to propose
 */
contract ProposerAdapterVePARS is IProposerAdapter, ERC165 {
    /// @notice The vePARS token used for voting power checks
    address public immutable vePARS;

    /// @notice Minimum voting power required to create proposals
    uint256 public immutable proposerThreshold;

    // ============ Constructor ============

    /**
     * @param _vePARS The vePARS token address
     * @param _proposerThreshold Minimum voting power to propose (0 = anyone with vePARS)
     */
    constructor(address _vePARS, uint256 _proposerThreshold) {
        require(_vePARS != address(0), "Invalid vePARS address");
        vePARS = _vePARS;
        proposerThreshold = _proposerThreshold;
    }

    // ============ IProposerAdapter ============

    /**
     * @notice Check if address can create proposals
     * @dev Uses vePARS.balanceOf() for time-weighted voting power
     * @param proposer The address to check
     * @param data Ignored for this adapter
     * @return True if proposer has sufficient voting power
     */
    function isProposer(
        address proposer,
        bytes calldata data
    ) public view override returns (bool) {
        // Silence unused parameter warning
        data;

        // Get vePARS voting power
        (bool success, bytes memory result) = vePARS.staticcall(
            abi.encodeWithSignature("balanceOf(address)", proposer)
        );

        if (!success || result.length < 32) {
            return false;
        }

        uint256 votingPower = abi.decode(result, (uint256));
        return votingPower >= proposerThreshold;
    }

    // ============ ERC165 ============

    function supportsInterface(bytes4 interfaceId) public view override returns (bool) {
        return
            interfaceId == type(IProposerAdapter).interfaceId ||
            super.supportsInterface(interfaceId);
    }
}
