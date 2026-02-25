// SPDX-License-Identifier: BSD-3-Clause
// Copyright (c) 2025 CYRUS Foundation
pragma solidity ^0.8.31;

import {IERC20, ERC20, SafeERC20} from "@luxfi/standard/tokens/ERC20.sol";
import {ReentrancyGuard} from "@luxfi/standard/utils/Utils.sol";
import {AccessControl} from "@luxfi/standard/access/Access.sol";

/**
 * @title PARS - Rebasing Governance Token
 * @notice OHM-style rebasing token for CYRUS ecosystem governance
 * @dev Based on DLUX pattern from @luxfi/contracts
 *
 * PARS TOKENOMICS:
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │  PARS is a rebasing governance token backed 1:1 by staked CYRUS            │
 * │  Named after the ancient Persian empire (Pars = Persia)                    │
 * │                                                                             │
 * │  Properties:                                                                │
 * │  - Backing: 1 CYRUS = 1 PARS (redeemable)                                   │
 * │  - Rebase Rate: 0.2-0.4% per epoch (8 hours)                                │
 * │  - Demurrage: 0.05% per day on unstaked PARS                                │
 * │  - Transferable: Yes                                                        │
 * │                                                                             │
 * │  Staking Tiers:                                                             │
 * │  - Mehr (100+): 1.0x boost, "sun/love"                                      │
 * │  - Zarrin (1K+): 1.1x boost, 7d lock, "golden"                              │
 * │  - Azadi (10K+): 1.25x boost, 30d lock, "freedom"                           │
 * │  - Shahzade (100K+): 1.5x boost, 90d lock, "prince"                         │
 * │  - Padshah (1M+): 2.0x boost, 365d lock, "king"                             │
 * │                                                                             │
 * │  Use Cases:                                                                 │
 * │  - Vote on CYRUS protocol parameters                                        │
 * │  - Vote on treasury allocations                                             │
 * │  - Propose governance changes                                               │
 * │  - Earn rebases for long-term commitment                                    │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */
contract PARS is ERC20, ReentrancyGuard, AccessControl {
    using SafeERC20 for IERC20;

    // ============ Constants ============

    /// @notice Role for rebase operators
    bytes32 public constant REBASE_ROLE = keccak256("REBASE_ROLE");

    /// @notice Role for parameter governance
    bytes32 public constant GOVERNOR_ROLE = keccak256("GOVERNOR_ROLE");

    /// @notice Role for emission minting
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    /// @notice Epoch duration (8 hours)
    uint256 public constant EPOCH_DURATION = 8 hours;

    /// @notice Demurrage rate per day in basis points (5 = 0.05%)
    uint256 public constant DEMURRAGE_BPS = 5;

    /// @notice Basis points denominator
    uint256 public constant BPS_DENOMINATOR = 10000;

    /// @notice Maximum rebase rate per epoch in basis points (40 = 0.4%)
    uint256 public constant MAX_REBASE_RATE = 40;

    /// @notice Minimum rebase rate per epoch in basis points (20 = 0.2%)
    uint256 public constant MIN_REBASE_RATE = 20;

    /// @notice Staking tier thresholds (in CYRUS - 6 decimals)
    uint256 public constant TIER_MEHR = 100e6;        // 100 CYRUS
    uint256 public constant TIER_ZARRIN = 1_000e6;    // 1K CYRUS
    uint256 public constant TIER_AZADI = 10_000e6;    // 10K CYRUS
    uint256 public constant TIER_SHAHZADE = 100_000e6; // 100K CYRUS
    uint256 public constant TIER_PADSHAH = 1_000_000e6; // 1M CYRUS

    /// @notice Lock periods per tier
    uint256 public constant LOCK_ZARRIN = 7 days;
    uint256 public constant LOCK_AZADI = 30 days;
    uint256 public constant LOCK_SHAHZADE = 90 days;
    uint256 public constant LOCK_PADSHAH = 365 days;

    /// @notice Tier boosts in basis points (10000 = 1.0x)
    uint256 public constant BOOST_MEHR = 10000;       // 1.0x
    uint256 public constant BOOST_ZARRIN = 11000;     // 1.1x
    uint256 public constant BOOST_AZADI = 12500;      // 1.25x
    uint256 public constant BOOST_SHAHZADE = 15000;   // 1.5x
    uint256 public constant BOOST_PADSHAH = 20000;    // 2.0x

    // ============ Types ============

    /// @notice Staking tiers (Persian names)
    enum Tier { None, Mehr, Zarrin, Azadi, Shahzade, Padshah }

    struct StakeInfo {
        uint256 amount;         // Amount staked
        uint256 lockEnd;        // Lock end timestamp
        uint256 lastRebase;     // Last rebase claim timestamp
        uint256 pendingRebase;  // Accumulated unclaimed rebases
        Tier tier;              // Current tier
    }

    struct DemurrageInfo {
        uint256 balance;        // Balance subject to demurrage
        uint256 lastUpdate;     // Last demurrage calculation timestamp
    }

    // ============ State ============

    /// @notice The CYRUS stablecoin
    IERC20 public immutable cyrus;

    /// @notice Current rebase rate in basis points
    uint256 public rebaseRate;

    /// @notice Current epoch
    uint256 public epoch;

    /// @notice Last epoch timestamp
    uint256 public lastEpochTime;

    /// @notice Total staked CYRUS
    uint256 public totalStaked;

    /// @notice Protocol treasury address
    address public treasury;

    /// @notice Staking info per user
    mapping(address => StakeInfo) public stakes;

    /// @notice Demurrage tracking for unstaked balances
    mapping(address => DemurrageInfo) private _demurrage;

    /// @notice Whether emissions are paused
    bool public paused;

    /// @notice Addresses exempt from demurrage (protocol contracts)
    mapping(address => bool) public demurrageExempt;

    // ============ Events ============

    event Staked(address indexed user, uint256 amount, Tier tier, uint256 lockEnd);
    event Unstaked(address indexed user, uint256 amount, uint256 cyrusReturned);
    event RebaseClaimed(address indexed user, uint256 amount);
    event Rebased(uint256 epoch, uint256 totalRebased, uint256 rate);
    event DemurrageApplied(address indexed account, uint256 burned);
    event TierUpgraded(address indexed user, Tier from, Tier to);
    event RebaseRateUpdated(uint256 oldRate, uint256 newRate);
    event TreasuryUpdated(address indexed oldTreasury, address indexed newTreasury);
    event Paused(bool status);
    event Minted(address indexed to, uint256 amount, bytes32 indexed reason);
    event DemurrageExemptionSet(address indexed account, bool exempt);

    // ============ Errors ============

    error ZeroAmount();
    error ZeroAddress();
    error InsufficientBalance();
    error LockNotExpired();
    error InvalidTier();
    error InvalidRebaseRate();
    error EpochNotReady();
    error IsPaused();
    error DowngradeTier();

    // ============ Constructor ============

    constructor(
        address _cyrus,
        address _treasury,
        address admin
    ) ERC20("PARS Governance", "PARS") {
        if (_cyrus == address(0) || _treasury == address(0) || admin == address(0)) {
            revert ZeroAddress();
        }

        cyrus = IERC20(_cyrus);
        treasury = _treasury;
        rebaseRate = 30; // 0.3% per epoch default

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(REBASE_ROLE, admin);
        _grantRole(GOVERNOR_ROLE, admin);

        lastEpochTime = block.timestamp;
    }

    // ============ External Functions ============

    /// @notice Stake CYRUS to receive PARS
    /// @param amount Amount of CYRUS to stake
    /// @param tier Desired staking tier
    /// @return parsMinted Amount of PARS minted
    function stake(uint256 amount, Tier tier) external nonReentrant returns (uint256 parsMinted) {
        if (paused) revert IsPaused();
        if (amount == 0) revert ZeroAmount();
        if (tier == Tier.None) revert InvalidTier();

        // Validate tier requirements
        uint256 newTotal = stakes[msg.sender].amount + amount;
        _validateTier(tier, newTotal);

        // Transfer CYRUS from user
        cyrus.safeTransferFrom(msg.sender, address(this), amount);

        // Update stake info
        StakeInfo storage info = stakes[msg.sender];

        // Claim any pending rebases first
        if (info.pendingRebase > 0) {
            _claimRebase(msg.sender);
        }

        // Calculate new lock end
        uint256 lockPeriod = _getLockPeriod(tier);
        uint256 newLockEnd = block.timestamp + lockPeriod;

        // Only extend lock, never reduce
        if (newLockEnd < info.lockEnd) {
            newLockEnd = info.lockEnd;
        }

        // Check for tier upgrade
        Tier oldTier = info.tier;
        if (tier > oldTier) {
            emit TierUpgraded(msg.sender, oldTier, tier);
        } else if (tier < oldTier) {
            revert DowngradeTier();
        }

        info.amount = newTotal;
        info.lockEnd = newLockEnd;
        info.lastRebase = block.timestamp;
        info.tier = tier;

        totalStaked += amount;
        parsMinted = amount;

        // Mint PARS 1:1
        _mint(msg.sender, amount);

        emit Staked(msg.sender, amount, tier, newLockEnd);
    }

    /// @notice Unstake PARS to receive CYRUS
    /// @param amount Amount of PARS to unstake
    /// @return cyrusReturned Amount of CYRUS returned
    function unstake(uint256 amount) external nonReentrant returns (uint256 cyrusReturned) {
        if (amount == 0) revert ZeroAmount();

        StakeInfo storage info = stakes[msg.sender];
        if (amount > info.amount) revert InsufficientBalance();
        if (block.timestamp < info.lockEnd) revert LockNotExpired();

        // Claim pending rebases first
        if (info.pendingRebase > 0) {
            _claimRebase(msg.sender);
        }

        // Update stake info
        info.amount -= amount;
        totalStaked -= amount;

        // Burn PARS
        _burn(msg.sender, amount);

        // Return CYRUS 1:1
        cyrusReturned = amount;
        cyrus.safeTransfer(msg.sender, cyrusReturned);

        // Update tier if needed
        if (info.amount < _getTierMinimum(info.tier)) {
            info.tier = _calculateTier(info.amount);
        }

        emit Unstaked(msg.sender, amount, cyrusReturned);
    }

    /// @notice Redeem PARS for underlying CYRUS 1:1 (no lock)
    /// @dev Only works for unstaked PARS balance
    /// @param amount Amount to redeem
    /// @return cyrusReturned Amount of CYRUS returned
    function redeem(uint256 amount) external nonReentrant returns (uint256 cyrusReturned) {
        if (amount == 0) revert ZeroAmount();

        // Apply demurrage first
        _applyDemurrage(msg.sender);

        uint256 unstaked = balanceOf(msg.sender) - stakes[msg.sender].amount;
        if (amount > unstaked) revert InsufficientBalance();

        // Burn PARS
        _burn(msg.sender, amount);

        // Return CYRUS 1:1
        cyrusReturned = amount;
        cyrus.safeTransfer(msg.sender, cyrusReturned);
    }

    /// @notice Claim accumulated rebases
    /// @return rebased Amount of PARS rebased
    function claimRebase() external nonReentrant returns (uint256 rebased) {
        return _claimRebase(msg.sender);
    }

    /// @notice Get pending rebase amount for account
    /// @param account Address to query
    /// @return pending Pending rebase amount
    function pendingRebase(address account) external view returns (uint256 pending) {
        StakeInfo memory info = stakes[account];
        if (info.amount == 0) return 0;

        pending = info.pendingRebase;

        // Calculate additional rebases since last claim
        uint256 epochsSince = (block.timestamp - info.lastRebase) / EPOCH_DURATION;
        if (epochsSince > 0) {
            uint256 boost = _getTierBoost(info.tier);
            uint256 epochRebase = (info.amount * rebaseRate * boost) / (BPS_DENOMINATOR * BPS_DENOMINATOR);
            pending += epochRebase * epochsSince;
        }

        return pending;
    }

    /// @notice Apply demurrage to account (anyone can call)
    /// @param account Address to apply demurrage
    function applyDemurrage(address account) external {
        _applyDemurrage(account);
    }

    /// @notice Trigger epoch rebase (callable by anyone when epoch is ready)
    function rebase() external nonReentrant {
        if (paused) revert IsPaused();
        if (block.timestamp < lastEpochTime + EPOCH_DURATION) revert EpochNotReady();

        uint256 epochs = (block.timestamp - lastEpochTime) / EPOCH_DURATION;
        if (epochs == 0) revert EpochNotReady();

        // Update epoch tracking
        epoch += epochs;
        lastEpochTime = lastEpochTime + (epochs * EPOCH_DURATION);

        // Calculate total rebase amount
        uint256 totalRebased = (totalStaked * rebaseRate * epochs) / BPS_DENOMINATOR;

        emit Rebased(epoch, totalRebased, rebaseRate);
    }

    // ============ View Functions ============

    /// @notice Get staking tier for account
    /// @param account Address to query
    /// @return tier Current tier
    /// @return boost Boost multiplier in basis points
    function tierOf(address account) external view returns (Tier tier, uint256 boost) {
        tier = stakes[account].tier;
        boost = _getTierBoost(tier);
    }

    /// @notice Get stake details for account
    /// @param account Address to query
    function getStake(address account) external view returns (
        uint256 amount,
        uint256 lockEnd,
        Tier tier,
        uint256 boost
    ) {
        StakeInfo memory info = stakes[account];
        return (info.amount, info.lockEnd, info.tier, _getTierBoost(info.tier));
    }

    /// @notice Get effective balance after demurrage
    /// @param account Address to query
    /// @return Effective balance
    function effectiveBalance(address account) external view returns (uint256) {
        uint256 staked = stakes[account].amount;
        uint256 unstaked = balanceOf(account) - staked;

        if (unstaked == 0) return staked;

        // Calculate demurrage on unstaked portion
        DemurrageInfo memory dem = _demurrage[account];
        if (dem.lastUpdate == 0) {
            dem.balance = unstaked;
            dem.lastUpdate = block.timestamp;
        }

        uint256 daysPassed = (block.timestamp - dem.lastUpdate) / 1 days;
        if (daysPassed > 0) {
            // Compound demurrage
            for (uint256 i = 0; i < daysPassed && i < 365; i++) {
                unstaked = (unstaked * (BPS_DENOMINATOR - DEMURRAGE_BPS)) / BPS_DENOMINATOR;
            }
        }

        return staked + unstaked;
    }

    /// @notice Token decimals (6 to match CYRUS)
    function decimals() public pure override returns (uint8) {
        return 6;
    }

    // ============ Governance Functions ============

    /// @notice Set rebase rate (governance only)
    /// @param newRate New rate in basis points
    function setRebaseRate(uint256 newRate) external onlyRole(GOVERNOR_ROLE) {
        if (newRate < MIN_REBASE_RATE || newRate > MAX_REBASE_RATE) {
            revert InvalidRebaseRate();
        }
        emit RebaseRateUpdated(rebaseRate, newRate);
        rebaseRate = newRate;
    }

    /// @notice Set treasury address
    /// @param newTreasury New treasury address
    function setTreasury(address newTreasury) external onlyRole(GOVERNOR_ROLE) {
        if (newTreasury == address(0)) revert ZeroAddress();
        emit TreasuryUpdated(treasury, newTreasury);
        treasury = newTreasury;
    }

    /// @notice Pause/unpause emissions
    /// @param _paused Paused status
    function setPaused(bool _paused) external onlyRole(GOVERNOR_ROLE) {
        paused = _paused;
        emit Paused(_paused);
    }

    /// @notice Set demurrage exemption for protocol contracts (e.g., vePARS)
    /// @param account Address to set exemption for
    /// @param exempt Whether the address is exempt from demurrage
    function setDemurrageExempt(address account, bool exempt) external onlyRole(GOVERNOR_ROLE) {
        demurrageExempt[account] = exempt;
        emit DemurrageExemptionSet(account, exempt);
    }

    // ============ Minter Functions ============

    /// @notice Mint PARS for strategic emissions
    /// @param to Recipient address
    /// @param amount Amount to mint
    /// @param reason Emission reason for logging
    function mint(address to, uint256 amount, bytes32 reason) external onlyRole(MINTER_ROLE) {
        if (to == address(0)) revert ZeroAddress();
        if (amount == 0) revert ZeroAmount();

        _mint(to, amount);

        // Initialize demurrage tracking for new holder
        DemurrageInfo storage dem = _demurrage[to];
        if (dem.lastUpdate == 0) {
            dem.lastUpdate = block.timestamp;
        }

        emit Minted(to, amount, reason);
    }

    // ============ Internal Functions ============

    function _claimRebase(address account) internal returns (uint256 rebased) {
        StakeInfo storage info = stakes[account];
        if (info.amount == 0) return 0;

        // Calculate epochs since last claim
        uint256 epochsSince = (block.timestamp - info.lastRebase) / EPOCH_DURATION;

        if (epochsSince > 0) {
            uint256 boost = _getTierBoost(info.tier);
            uint256 epochRebase = (info.amount * rebaseRate * boost) / (BPS_DENOMINATOR * BPS_DENOMINATOR);
            info.pendingRebase += epochRebase * epochsSince;
        }

        rebased = info.pendingRebase;
        if (rebased > 0) {
            info.pendingRebase = 0;
            info.lastRebase = block.timestamp;

            // Mint rebased PARS (backed by treasury)
            _mint(account, rebased);

            emit RebaseClaimed(account, rebased);
        }
    }

    function _applyDemurrage(address account) internal {
        // Protocol contracts are exempt from demurrage
        if (demurrageExempt[account]) return;

        uint256 staked = stakes[account].amount;
        uint256 total = balanceOf(account);
        uint256 unstaked = total > staked ? total - staked : 0;

        if (unstaked == 0) return;

        DemurrageInfo storage dem = _demurrage[account];
        if (dem.lastUpdate == 0) {
            dem.balance = unstaked;
            dem.lastUpdate = block.timestamp;
            return;
        }

        uint256 daysPassed = (block.timestamp - dem.lastUpdate) / 1 days;
        if (daysPassed == 0) return;

        // Update timestamp BEFORE burn to prevent recursion
        dem.lastUpdate = block.timestamp;

        // Calculate demurrage
        uint256 remaining = unstaked;
        for (uint256 i = 0; i < daysPassed && i < 365; i++) {
            remaining = (remaining * (BPS_DENOMINATOR - DEMURRAGE_BPS)) / BPS_DENOMINATOR;
        }

        uint256 burned = unstaked - remaining;
        dem.balance = remaining;

        if (burned > 0) {
            _burn(account, burned);
            emit DemurrageApplied(account, burned);
        }
    }

    function _validateTier(Tier tier, uint256 amount) internal pure {
        uint256 minimum = _getTierMinimum(tier);
        if (amount < minimum) revert InvalidTier();
    }

    function _getTierMinimum(Tier tier) internal pure returns (uint256) {
        if (tier == Tier.Padshah) return TIER_PADSHAH;
        if (tier == Tier.Shahzade) return TIER_SHAHZADE;
        if (tier == Tier.Azadi) return TIER_AZADI;
        if (tier == Tier.Zarrin) return TIER_ZARRIN;
        if (tier == Tier.Mehr) return TIER_MEHR;
        return 0;
    }

    function _getTierBoost(Tier tier) internal pure returns (uint256) {
        if (tier == Tier.Padshah) return BOOST_PADSHAH;
        if (tier == Tier.Shahzade) return BOOST_SHAHZADE;
        if (tier == Tier.Azadi) return BOOST_AZADI;
        if (tier == Tier.Zarrin) return BOOST_ZARRIN;
        if (tier == Tier.Mehr) return BOOST_MEHR;
        return BPS_DENOMINATOR; // 1.0x for no tier
    }

    function _getLockPeriod(Tier tier) internal pure returns (uint256) {
        if (tier == Tier.Padshah) return LOCK_PADSHAH;
        if (tier == Tier.Shahzade) return LOCK_SHAHZADE;
        if (tier == Tier.Azadi) return LOCK_AZADI;
        if (tier == Tier.Zarrin) return LOCK_ZARRIN;
        return 0; // Mehr has no lock
    }

    function _calculateTier(uint256 amount) internal pure returns (Tier) {
        if (amount >= TIER_PADSHAH) return Tier.Padshah;
        if (amount >= TIER_SHAHZADE) return Tier.Shahzade;
        if (amount >= TIER_AZADI) return Tier.Azadi;
        if (amount >= TIER_ZARRIN) return Tier.Zarrin;
        if (amount >= TIER_MEHR) return Tier.Mehr;
        return Tier.None;
    }

    /// @dev Override to apply demurrage before transfers
    function _update(address from, address to, uint256 amount) internal virtual override {
        // Apply demurrage on sender if not minting
        if (from != address(0)) {
            _applyDemurrage(from);
        }

        super._update(from, to, amount);

        // Initialize demurrage tracking for receiver
        if (to != address(0) && from != address(0)) {
            DemurrageInfo storage dem = _demurrage[to];
            if (dem.lastUpdate == 0) {
                dem.lastUpdate = block.timestamp;
            }
        }
    }
}
