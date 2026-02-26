// Cyrus DAO Bonding Curve - Per-Chain Pricing
//
// 8 chains compete for 1B CYRUS tokens.
// Allocation is proportional to each chain's USD contribution.
// Price goes from $0.01 to $1.00 as each chain fills up.

export const TOTAL_SUPPLY = 1_000_000_000  // 1B CYRUS total
export const SALE_SUPPLY  = 900_000_000    // 900M for presale (100M LP reserve)
export const FUND_TARGET  = 100_000_000    // $100M presale goal
export const MIN_PRICE    = 0.01           // Starting price per CYRUS
export const MAX_PRICE    = 1.00           // Ending price per CYRUS

// Per-chain allocation (percentage of total target)
export const CHAIN_ALLOCATIONS: Record<string, number> = {
  BITCOIN:   0.20, // 20% — $20M target
  ETHEREUM:  0.25, // 25% — $25M target (incl. L2s)
  BSC:       0.10, // 10% — $10M target
  SOLANA:    0.15, // 15% — $15M target
  XRP:       0.10, // 10% — $10M target
  TON:       0.10, // 10% — $10M target
  LUX:       0.05, // 5%  — $5M target
  ZOO:       0.05, // 5%  — $5M target
}

// Max USD target per chain
export const CHAIN_MAX_USD: Record<string, number> = Object.fromEntries(
  Object.entries(CHAIN_ALLOCATIONS).map(([id, pct]) => [id, FUND_TARGET * pct])
)

// Map individual chain IDs to consolidated treasury chain IDs
export const TREASURY_CHAIN_MAP: Record<string, string> = {
  BITCOIN:  'BITCOIN',
  ETHEREUM: 'ETHEREUM',
  BASE:     'ETHEREUM',
  OPTIMISM: 'ETHEREUM',
  ARBITRUM: 'ETHEREUM',
  BSC:      'BSC',
  SOLANA:   'SOLANA',
  XRP:      'XRP',
  TON:      'TON',
  LUX:      'LUX',
  ZOO:      'ZOO',
}

export function getMintPrice(raisedUsd: number, chainId: string): number {
  const id = TREASURY_CHAIN_MAP[chainId] || chainId
  const maxUsd = CHAIN_MAX_USD[id] || 0
  if (maxUsd === 0) return MAX_PRICE
  const progress = Math.min(raisedUsd / maxUsd, 1)
  return MIN_PRICE + (MAX_PRICE - MIN_PRICE) * progress
}

export function getCyrusForUsd(raisedUsd: number, chainId: string, usdAmount: number): number {
  const price = getMintPrice(raisedUsd, chainId)
  if (price === 0) return 0
  return usdAmount / price
}

export function getChainProgress(raisedUsd: number, chainId: string): number {
  const id = TREASURY_CHAIN_MAP[chainId] || chainId
  const maxUsd = CHAIN_MAX_USD[id] || 0
  if (maxUsd === 0) return 0
  return Math.min((raisedUsd / maxUsd) * 100, 100)
}

export function getChainAllocation(chainId: string): number {
  const id = TREASURY_CHAIN_MAP[chainId] || chainId
  const pct = CHAIN_ALLOCATIONS[id] || 0
  return SALE_SUPPLY * pct
}

export function formatCyrus(amount: number): string {
  if (amount >= 1_000_000_000) return `${(amount / 1_000_000_000).toFixed(1)}B`
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(0)}M`
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(0)}K`
  return amount.toFixed(0)
}
