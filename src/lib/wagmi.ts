import { http, createConfig } from 'wagmi'
import { defineChain } from 'viem'
import { base } from 'wagmi/chains'
import { injected, coinbaseWallet } from 'wagmi/connectors'

// Local Anvil chain for testing
const localhost = defineChain({
  id: 31337,
  name: 'Localhost',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['http://127.0.0.1:8545'] },
  },
})

// Set to true for local testing, false for production
const IS_LOCAL = import.meta.env.VITE_LOCAL === 'true'

export const config = createConfig({
  chains: IS_LOCAL ? [localhost] : [base],
  connectors: [
    injected(),
    coinbaseWallet({ appName: 'CYRUS' }),
  ],
  transports: IS_LOCAL
    ? { [localhost.id]: http() }
    : { [base.id]: http() },
})

// Contract addresses - LOCAL (Anvil)
const LOCAL_CYRUS_ADDRESS = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0' as const
const LOCAL_USDT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3' as const

// Contract addresses - PRODUCTION (Base) - UPDATE AFTER DEPLOYMENT
const PROD_CYRUS_ADDRESS = '0x0000000000000000000000000000000000000000' as const
const PROD_USDT_ADDRESS = '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA' as const // USDbC on Base

// Export active addresses based on environment
export const CYRUS_ADDRESS = IS_LOCAL ? LOCAL_CYRUS_ADDRESS : PROD_CYRUS_ADDRESS
export const USDT_ADDRESS = IS_LOCAL ? LOCAL_USDT_ADDRESS : PROD_USDT_ADDRESS

// Trading Links - UPDATE AFTER DEPLOYMENT
export const TRADING_LINKS = {
  uniswap: `https://app.uniswap.org/swap?outputCurrency=${CYRUS_ADDRESS}&chain=base`,
  dexscreener: `https://dexscreener.com/base/${CYRUS_ADDRESS}`,
  basescan: `https://basescan.org/token/${CYRUS_ADDRESS}`,
} as const

// USDT (ERC20) ABI for approve
export const USDT_ABI = [
  {
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  // Faucet for local testing (MockUSDT only)
  {
    inputs: [],
    name: 'faucet',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

// CYRUS Token ABI - USDT Bonding Curve
export const CYRUS_ABI = [
  // Buy with USDT (no slippage protection)
  {
    inputs: [{ name: 'usdtAmount', type: 'uint256' }],
    name: 'buy',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  // Buy with USDT and slippage protection
  {
    inputs: [
      { name: 'usdtAmount', type: 'uint256' },
      { name: 'minTokensOut', type: 'uint256' },
    ],
    name: 'buy',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  // Get current price in USDT (6 decimals)
  {
    inputs: [],
    name: 'getCurrentPrice',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  // Calculate tokens for USDT amount
  {
    inputs: [{ name: 'usdtAmount', type: 'uint256' }],
    name: 'calculateTokensForUsdt',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  // Tokens sold so far
  {
    inputs: [],
    name: 'tokensSold',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  // USDT raised so far
  {
    inputs: [],
    name: 'usdtRaised',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  // Sale active flag
  {
    inputs: [],
    name: 'saleActive',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  // Start price constant ($0.01 = 10000 with 6 decimals)
  {
    inputs: [],
    name: 'START_PRICE',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  // End price constant ($1.00 = 1000000 with 6 decimals)
  {
    inputs: [],
    name: 'END_PRICE',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  // Sale supply
  {
    inputs: [],
    name: 'SALE_SUPPLY',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  // Balance check
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  // Total supply
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  // Nowruz 2026 timestamp (transfers unlock)
  {
    inputs: [],
    name: 'NOWRUZ_2026',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  // Check if transfers are enabled
  {
    inputs: [],
    name: 'transfersEnabled',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

// Nowruz 2026 - March 21, 2026 12:00:00 UTC
export const NOWRUZ_2026 = 1742558400
