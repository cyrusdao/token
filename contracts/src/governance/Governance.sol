// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.31;

/**
 * @title CYRUS Governance
 * @notice Re-exports governance contracts from @luxfi/standard
 * @dev All governance infrastructure comes from audited Lux contracts
 *
 * GOVERNANCE ARCHITECTURE:
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │                                                                             │
 * │                           CYRUS GOVERNANCE FLOW                             │
 * │                                                                             │
 * │   ┌─────────────┐     ┌──────────────┐     ┌──────────────┐                │
 * │   │   vePARS    │────▶│   Strategy   │────▶│   Governor   │                │
 * │   │ (Voting     │     │ (Vote Logic) │     │ (Proposals)  │                │
 * │   │  Power)     │     └──────────────┘     └──────────────┘                │
 * │   └─────────────┘            │                    │                        │
 * │         ▲                    │                    ▼                        │
 * │         │                    │              ┌──────────┐                   │
 * │   ┌─────────────┐           ▼              │   Safe   │                   │
 * │   │    PARS     │     ┌──────────────┐     │ Multisig │                   │
 * │   │ (Governance │     │ VoteTracker  │     │(Treasury)│                   │
 * │   │   Token)    │     │ (Anti-Double)│     └──────────┘                   │
 * │   └─────────────┘     └──────────────┘           │                        │
 * │         ▲                                        ▼                        │
 * │         │                                  ┌──────────┐                   │
 * │   ┌─────────────┐                          │  CYRUS   │                   │
 * │   │   CYRUS     │◀─────────────────────────│  Token   │                   │
 * │   │ Stablecoin  │    (Mint/Burn via Safe)  └──────────┘                   │
 * │   └─────────────┘                                                         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * Components:
 * - Governor: Manages proposals, timelock, and execution via Safe
 * - Strategy: Voting logic (quorum, basis, vote tallying)
 * - VoteTracker: Prevents double voting
 * - ProposerAdapter: Who can create proposals
 * - VotingWeight: How much voting power each address has
 */

// Core governance from @luxfi/standard
import {Governor} from "@luxfi/standard/governance/Governor.sol";
import {Strategy} from "@luxfi/standard/governance/Strategy.sol";
import {Controller} from "@luxfi/standard/governance/Controller.sol";

// Voting infrastructure from @luxfi/standard
import {VoteTrackerLRC20} from "@luxfi/standard/governance/voting/VoteTrackerLRC20.sol";

// Interfaces from @luxfi/standard
import {IGovernor} from "@luxfi/standard/governance/interfaces/IGovernor.sol";
import {IStrategy} from "@luxfi/standard/governance/interfaces/IStrategy.sol";
import {IVotingWeight} from "@luxfi/standard/governance/interfaces/IVotingWeight.sol";
import {IVoteTracker} from "@luxfi/standard/governance/interfaces/IVoteTracker.sol";
import {IProposerAdapter} from "@luxfi/standard/governance/interfaces/IProposerAdapter.sol";
import {IVotingTypes} from "@luxfi/standard/governance/interfaces/IVotingTypes.sol";

// Base types from @luxfi/standard
import {Transaction} from "@luxfi/standard/governance/base/Transaction.sol";
import {Enum} from "@luxfi/standard/governance/base/Enum.sol";

// CYRUS-specific adapters
import {VotingWeightVePARS} from "./VotingWeightVePARS.sol";
import {ProposerAdapterVePARS} from "./ProposerAdapterVePARS.sol";
