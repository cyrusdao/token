// Cyrus DAO Treasury — Real On-Chain Balance Fetcher
//
// Fetches actual treasury wallet balances from public APIs.
// 8 consolidated chains: BTC, ETH (incl. L2s), BNB, SOL, XRP, TON, LUX, ZOO
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
// MAINNET Configuration — Same 8 DAO wallets
// ============================================
const MAINNET_TREASURY = {
  BITCOIN:  'bc1qem8jywyuc9wtgf7y5n9tyq6tknpj3l85tzg9y6',
  EVM:      '0xAaf3a7253c73a58f2713f454717C5338c6573d62', // ETH, Base, OP, Arb, BSC, Zoo
  SOLANA:   'BPTZhkTdRwqnrb7PnWvi6SkCWQHcvUZrfaYvPkZ2YD8R',
  XRP:      'raBQUYdAhnnojJQ6Xi3eXztZ74ot24RDq1',
  TON:      'UQCx0_0l9AxIouVBxThCRAwO7Yrz6rpQGI-1CS7h-lwjqRTW',
  LUX:      '0x14542918a9032248ef30d9bc1d57983691e3ade4',
  ZOO:      '0xAaf3a7253c73a58f2713f454717C5338c6573d62',
} as const

const MAINNET_RPCS: Record<string, string> = {
  ethereum: 'https://eth.llamarpc.com',
  base:     'https://mainnet.base.org',
  optimism: 'https://mainnet.optimism.io',
  arbitrum: 'https://arb1.arbitrum.io/rpc',
  bsc:      'https://bsc-dataseed.binance.org',
  lux:      'https://api.lux.network',
  zoo:      'https://rpc.zoo.id',
}

const MAINNET_BTC_API = 'https://blockstream.info/api'
const MAINNET_SOL_RPC = 'https://api.mainnet-beta.solana.com'
const MAINNET_XRP_API = 'https://api.xrpscan.com/api/v1'
const MAINNET_TON_API = 'https://toncenter.com/api/v2'

// ============================================
// TESTNET Configuration
// ============================================
const TESTNET_TREASURY = {
  BITCOIN:  'tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx',
  EVM:      '0xAaf3a7253c73a58f2713f454717C5338c6573d62',
  SOLANA:   'BPTZhkTdRwqnrb7PnWvi6SkCWQHcvUZrfaYvPkZ2YD8R',
  XRP:      'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
  TON:      'UQCx0_0l9AxIouVBxThCRAwO7Yrz6rpQGI-1CS7h-lwjqRTW',
  LUX:      '0x14542918a9032248ef30d9bc1d57983691e3ade4',
  ZOO:      '0xAaf3a7253c73a58f2713f454717C5338c6573d62',
} as const

const TESTNET_RPCS: Record<string, string> = {
  ethereum: 'https://rpc.sepolia.org',
  base:     'https://sepolia.base.org',
  optimism: 'https://sepolia.optimism.io',
  arbitrum: 'https://sepolia-rollup.arbitrum.io/rpc',
  bsc:      'https://data-seed-prebsc-1-s1.binance.org:8545',
  lux:      'https://api.lux-test.network',
  zoo:      'https://rpc-test.zoo.id',
}

const TESTNET_BTC_API = 'https://blockstream.info/testnet/api'
const TESTNET_SOL_RPC = 'https://api.devnet.solana.com'
const TESTNET_XRP_API = 'https://testnet.xrpl-labs.com'
const TESTNET_TON_API = 'https://testnet.toncenter.com/api/v2'

const TESTNET_PRICES: Record<string, number> = {
  BTC: 100000,
  ETH: 3500,
  BNB: 600,
  SOL: 200,
  XRP: 2.5,
  TON: 5,
  LUX: 0.5,
  ZOO: 0.1,
}

// ============================================
// Dynamic getters based on network mode
// ============================================
export const getTreasury = () => isTestnet() ? TESTNET_TREASURY : MAINNET_TREASURY
export const getEvmRpcs = () => isTestnet() ? TESTNET_RPCS : MAINNET_RPCS
export const getBtcApi = () => isTestnet() ? TESTNET_BTC_API : MAINNET_BTC_API
export const getSolRpc = () => isTestnet() ? TESTNET_SOL_RPC : MAINNET_SOL_RPC
export const getXrpApi = () => isTestnet() ? TESTNET_XRP_API : MAINNET_XRP_API
export const getTonApi = () => isTestnet() ? TESTNET_TON_API : MAINNET_TON_API

export const TREASURY = getTreasury()

const COINGECKO_IDS: Record<string, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  BNB: 'binancecoin',
  SOL: 'solana',
  XRP: 'ripple',
  TON: 'the-open-network',
  LUX: 'lux-network',
  ZOO: 'zoo-token',
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

async function fetchXrpBalance(): Promise<number> {
  const treasury = getTreasury()
  if (isTestnet()) {
    const data = await fetchJson(`https://testnet.xrpl-labs.com/account/${treasury.XRP}`)
    if (!data?.account_data?.Balance) return 0
    return parseInt(data.account_data.Balance) / 1e6
  }
  const data = await fetchJson(`${MAINNET_XRP_API}/account/${treasury.XRP}`)
  if (!data?.xrpBalance) return 0
  return parseFloat(data.xrpBalance) || 0
}

async function fetchTonBalance(): Promise<number> {
  const treasury = getTreasury()
  const api = getTonApi()
  const data = await fetchJson(`${api}/getAddressBalance?address=${treasury.TON}`)
  if (!data?.result) return 0
  return parseInt(data.result) / 1e9
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
    bnbBalance, solBalance, xrpBalance, tonBalance, luxBalance, zooBalance, prices,
  ] = await Promise.all([
    fetchBtcBalance(),
    fetchEvmBalance(rpcs.ethereum, treasury.EVM),
    fetchEvmBalance(rpcs.base, treasury.EVM),
    fetchEvmBalance(rpcs.optimism, treasury.EVM),
    fetchEvmBalance(rpcs.arbitrum, treasury.EVM),
    fetchEvmBalance(rpcs.bsc, treasury.EVM),
    fetchSolBalance(),
    fetchXrpBalance(),
    fetchTonBalance(),
    fetchEvmBalance(rpcs.lux, treasury.LUX),
    fetchEvmBalance(rpcs.zoo, treasury.ZOO),
    fetchPrices(),
  ])

  const totalEth = ethMainnet + ethBase + ethOptimism + ethArbitrum

  const chains: ChainBalance[] = [
    { id: 'BITCOIN', name: testnet ? 'Bitcoin (Testnet)' : 'Bitcoin', symbol: 'BTC', color: '#F7931A', icon: '/images/tokens/bitcoin.png', nativeBalance: btcBalance, usdValue: btcBalance * (prices.BTC || 0), price: prices.BTC || 0 },
    { id: 'ETHEREUM', name: testnet ? 'Ethereum (Sepolia)' : 'Ethereum', symbol: 'ETH', color: '#627EEA', icon: '/images/tokens/ethereum.png', nativeBalance: totalEth, usdValue: totalEth * (prices.ETH || 0), price: prices.ETH || 0, subChains: testnet ? ['Sepolia', 'Base Sepolia', 'OP Sepolia', 'Arb Sepolia'] : ['Mainnet', 'Base', 'Optimism', 'Arbitrum'] },
    { id: 'BSC', name: testnet ? 'BNB (Testnet)' : 'BNB Chain', symbol: 'BNB', color: '#F0B90B', icon: '/images/tokens/bnb.png', nativeBalance: bnbBalance, usdValue: bnbBalance * (prices.BNB || 0), price: prices.BNB || 0 },
    { id: 'SOLANA', name: testnet ? 'Solana (Devnet)' : 'Solana', symbol: 'SOL', color: '#9945FF', icon: '/images/tokens/solana.png', nativeBalance: solBalance, usdValue: solBalance * (prices.SOL || 0), price: prices.SOL || 0 },
    { id: 'XRP', name: testnet ? 'XRP (Testnet)' : 'XRP Ledger', symbol: 'XRP', color: '#23292F', icon: '/images/tokens/xrp.png', nativeBalance: xrpBalance, usdValue: xrpBalance * (prices.XRP || 0), price: prices.XRP || 0 },
    { id: 'TON', name: testnet ? 'TON (Testnet)' : 'TON', symbol: 'TON', color: '#0088CC', icon: '/images/tokens/ton.png', nativeBalance: tonBalance, usdValue: tonBalance * (prices.TON || 0), price: prices.TON || 0 },
    { id: 'LUX', name: testnet ? 'Lux (Testnet)' : 'Lux', symbol: 'LUX', color: '#C9A227', icon: '/images/tokens/lux.png', nativeBalance: luxBalance, usdValue: luxBalance * (prices.LUX || 0), price: prices.LUX || 0 },
    { id: 'ZOO', name: testnet ? 'Zoo (Testnet)' : 'Zoo Network', symbol: 'ZOO', color: '#10B981', icon: '/images/tokens/zoo.png', nativeBalance: zooBalance, usdValue: zooBalance * (prices.ZOO || 0), price: prices.ZOO || 0 },
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
  { id: 'BSC', name: 'BNB Chain', symbol: 'BNB', color: '#F0B90B', icon: '/images/tokens/bnb.png', nativeBalance: 0, usdValue: 0, price: 0 },
  { id: 'SOLANA', name: 'Solana', symbol: 'SOL', color: '#9945FF', icon: '/images/tokens/solana.png', nativeBalance: 0, usdValue: 0, price: 0 },
  { id: 'XRP', name: 'XRP Ledger', symbol: 'XRP', color: '#23292F', icon: '/images/tokens/xrp.png', nativeBalance: 0, usdValue: 0, price: 0 },
  { id: 'TON', name: 'TON', symbol: 'TON', color: '#0088CC', icon: '/images/tokens/ton.png', nativeBalance: 0, usdValue: 0, price: 0 },
  { id: 'LUX', name: 'Lux', symbol: 'LUX', color: '#C9A227', icon: '/images/tokens/lux.png', nativeBalance: 0, usdValue: 0, price: 0 },
  { id: 'ZOO', name: 'Zoo Network', symbol: 'ZOO', color: '#10B981', icon: '/images/tokens/zoo.png', nativeBalance: 0, usdValue: 0, price: 0 },
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
