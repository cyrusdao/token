// Cyrus DAO Treasury — Real On-Chain Balance Fetcher
//
// Fetches actual treasury wallet balances from public APIs.
// 3 consolidated chains: BTC, ETH (incl. L2s), SOL
// Supports both mainnet and testnet modes for testing.

export const FUND_TARGET = 100_000_000 // $100M presale goal

// Check for testnet mode via env var or URL param
const isTestnet = (): boolean => {
  if (import.meta.env.VITE_TESTNET === 'true') return true
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search)
    if (params.get('testnet') === 'true') return true
  }
  return false
}

// ============================================
// MAINNET Configuration — 3 DAO wallets
// ============================================
const MAINNET_TREASURY = {
  BITCOIN:  'bc1qem8jywyuc9wtgf7y5n9tyq6tknpj3l85tzg9y6',
  EVM:      '0xAaf3a7253c73a58f2713f454717C5338c6573d62', // ETH, Base, OP, Arb
  SOLANA:   'BPTZhkTdRwqnrb7PnWvi6SkCWQHcvUZrfaYvPkZ2YD8R',
} as const

const MAINNET_RPCS: Record<string, string> = {
  ethereum: 'https://eth.llamarpc.com',
  base:     'https://mainnet.base.org',
  optimism: 'https://mainnet.optimism.io',
  arbitrum: 'https://arb1.arbitrum.io/rpc',
}

const MAINNET_BTC_API = 'https://blockstream.info/api'
const MAINNET_SOL_RPC = 'https://api.mainnet-beta.solana.com'

// ============================================
// TESTNET Configuration
// ============================================
const TESTNET_TREASURY = {
  BITCOIN:  'tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx',
  EVM:      '0xAaf3a7253c73a58f2713f454717C5338c6573d62',
  SOLANA:   'BPTZhkTdRwqnrb7PnWvi6SkCWQHcvUZrfaYvPkZ2YD8R',
} as const

const TESTNET_RPCS: Record<string, string> = {
  ethereum: 'https://rpc.sepolia.org',
  base:     'https://sepolia.base.org',
  optimism: 'https://sepolia.optimism.io',
  arbitrum: 'https://sepolia-rollup.arbitrum.io/rpc',
}

const TESTNET_BTC_API = 'https://blockstream.info/testnet/api'
const TESTNET_SOL_RPC = 'https://api.devnet.solana.com'

const TESTNET_PRICES: Record<string, number> = {
  BTC: 100000,
  ETH: 3500,
  SOL: 200,
}

// ============================================
// Dynamic getters based on network mode
// ============================================
export const getTreasury = () => isTestnet() ? TESTNET_TREASURY : MAINNET_TREASURY
export const getEvmRpcs = () => isTestnet() ? TESTNET_RPCS : MAINNET_RPCS
export const getBtcApi = () => isTestnet() ? TESTNET_BTC_API : MAINNET_BTC_API
export const getSolRpc = () => isTestnet() ? TESTNET_SOL_RPC : MAINNET_SOL_RPC

export const TREASURY = getTreasury()

const COINGECKO_IDS: Record<string, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  SOL: 'solana',
}

export interface ChainBalance {
  id: string
  name: string
  symbol: string
  color: string
  icon: string
  nativeBalance: number
  usdValue: number
  price: number
  subChains?: string[]
}

export interface TreasuryState {
  chains: ChainBalance[]
  totalUsd: number
  progressPct: number
  lastUpdated: number
  isTestnet: boolean
}

async function fetchJson(url: string, init?: RequestInit): Promise<any> {
  try {
    const res = await fetch(url, { ...init, signal: AbortSignal.timeout(8000) })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

async function fetchBtcBalance(): Promise<number> {
  const treasury = getTreasury()
  const api = getBtcApi()
  const data = await fetchJson(`${api}/address/${treasury.BITCOIN}`)
  if (!data?.chain_stats) return 0
  const sats = (data.chain_stats.funded_txo_sum || 0) - (data.chain_stats.spent_txo_sum || 0)
  return Math.max(sats / 1e8, 0)
}

async function fetchEvmBalance(rpc: string, address: string): Promise<number> {
  const data = await fetchJson(rpc, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', method: 'eth_getBalance', params: [address, 'latest'], id: 1 }),
  })
  if (!data?.result) return 0
  return parseInt(data.result, 16) / 1e18
}

async function fetchSolBalance(): Promise<number> {
  const treasury = getTreasury()
  const rpc = getSolRpc()
  const data = await fetchJson(rpc, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', method: 'getBalance', params: [treasury.SOLANA], id: 1 }),
  })
  if (!data?.result?.value) return 0
  return data.result.value / 1e9
}

async function fetchPrices(): Promise<Record<string, number>> {
  if (isTestnet()) return TESTNET_PRICES
  const ids = Object.values(COINGECKO_IDS).join(',')
  const data = await fetchJson(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`)
  if (!data) return TESTNET_PRICES
  const prices: Record<string, number> = {}
  for (const [symbol, geckoId] of Object.entries(COINGECKO_IDS)) {
    prices[symbol] = data[geckoId]?.usd || 0
  }
  return prices
}

export async function fetchTreasuryBalances(): Promise<TreasuryState> {
  const treasury = getTreasury()
  const rpcs = getEvmRpcs()
  const testnet = isTestnet()

  const [
    btcBalance, ethMainnet, ethBase, ethOptimism, ethArbitrum,
    solBalance, prices,
  ] = await Promise.all([
    fetchBtcBalance(),
    fetchEvmBalance(rpcs.ethereum, treasury.EVM),
    fetchEvmBalance(rpcs.base, treasury.EVM),
    fetchEvmBalance(rpcs.optimism, treasury.EVM),
    fetchEvmBalance(rpcs.arbitrum, treasury.EVM),
    fetchSolBalance(),
    fetchPrices(),
  ])

  const totalEth = ethMainnet + ethBase + ethOptimism + ethArbitrum

  const chains: ChainBalance[] = [
    { id: 'BITCOIN', name: testnet ? 'Bitcoin (Testnet)' : 'Bitcoin', symbol: 'BTC', color: '#F7931A', icon: '/images/tokens/bitcoin.png', nativeBalance: btcBalance, usdValue: btcBalance * (prices.BTC || 0), price: prices.BTC || 0 },
    { id: 'ETHEREUM', name: testnet ? 'Ethereum (Sepolia)' : 'Ethereum', symbol: 'ETH', color: '#627EEA', icon: '/images/tokens/ethereum.png', nativeBalance: totalEth, usdValue: totalEth * (prices.ETH || 0), price: prices.ETH || 0, subChains: testnet ? ['Sepolia', 'Base Sepolia', 'OP Sepolia', 'Arb Sepolia'] : ['Mainnet', 'Base', 'Optimism', 'Arbitrum'] },
    { id: 'SOLANA', name: testnet ? 'Solana (Devnet)' : 'Solana', symbol: 'SOL', color: '#9945FF', icon: '/images/tokens/solana.png', nativeBalance: solBalance, usdValue: solBalance * (prices.SOL || 0), price: prices.SOL || 0 },
  ]

  chains.sort((a, b) => b.usdValue - a.usdValue)
  const totalUsd = chains.reduce((sum, c) => sum + c.usdValue, 0)

  return { chains, totalUsd, progressPct: Math.min((totalUsd / FUND_TARGET) * 100, 100), lastUpdated: Date.now(), isTestnet: testnet }
}

// --- React Hook ---

import { useState, useEffect, useCallback } from 'react'

const REFRESH_INTERVAL = 30_000

const DEFAULT_CHAINS: ChainBalance[] = [
  { id: 'BITCOIN', name: 'Bitcoin', symbol: 'BTC', color: '#F7931A', icon: '/images/tokens/bitcoin.png', nativeBalance: 0, usdValue: 0, price: 0 },
  { id: 'ETHEREUM', name: 'Ethereum', symbol: 'ETH', color: '#627EEA', icon: '/images/tokens/ethereum.png', nativeBalance: 0, usdValue: 0, price: 0, subChains: ['Mainnet', 'Base', 'Optimism', 'Arbitrum'] },
  { id: 'SOLANA', name: 'Solana', symbol: 'SOL', color: '#9945FF', icon: '/images/tokens/solana.png', nativeBalance: 0, usdValue: 0, price: 0 },
]

export function useTreasury() {
  const [state, setState] = useState<TreasuryState>({ chains: DEFAULT_CHAINS, totalUsd: 0, progressPct: 0, lastUpdated: 0, isTestnet: isTestnet() })
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const data = await fetchTreasuryBalances()
      setState(data)
    } catch {
      setState(prev => prev.chains.length > 0 ? prev : { ...prev, chains: DEFAULT_CHAINS })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
    const interval = setInterval(refresh, REFRESH_INTERVAL)
    return () => clearInterval(interval)
  }, [refresh])

  const prices: Record<string, number> = {}
  for (const chain of state.chains) { prices[chain.id] = chain.price }

  return { ...state, loading, refresh, prices }
}

export function formatUsd(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`
  if (n > 0 && n < 1) return `$${n.toFixed(2)}`
  return `$${n.toFixed(0)}`
}

export function formatNative(n: number, symbol: string): string {
  if (symbol === 'BTC') return `${n.toFixed(4)} BTC`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K ${symbol}`
  return `${n.toFixed(2)} ${symbol}`
}
