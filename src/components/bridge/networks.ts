// Cyrus DAO - Supported Networks for Presale
// 7 native chains: BTC, ETH, SOL, BNB, XRP, TON, LUX
// CYRUS claimable on Pars Network after mint date

import type { ChainConfig, DAOWalletConfig, DonationAsset } from './types';

const DEPOSIT_ADDRESSES = {
  BITCOIN: 'bc1qem8jywyuc9wtgf7y5n9tyq6tknpj3l85tzg9y6',
  EVM:     '0xAaf3a7253c73a58f2713f454717C5338c6573d62', // ETH, Base, Optimism, Arbitrum, BSC
  SOLANA:  'BPTZhkTdRwqnrb7PnWvi6SkCWQHcvUZrfaYvPkZ2YD8R',
  XRP:     'raBQUYdAhnnojJQ6Xi3eXztZ74ot24RDq1',
  XRP_MEMO:'3943970694',
  TON:     'UQCx0_0l9AxIouVBxThCRAwO7Yrz6rpQGI-1CS7h-lwjqRTW',
  TON_MEMO:'GEMGW3X626VA3',
  LUX:     '0x14542918a9032248ef30d9bc1d57983691e3ade4',
};

export const CYRUS_DAO_WALLET: DAOWalletConfig = {
  name: 'Cyrus DAO Treasury',
  backend: 'utila',
  signers: 5,
  threshold: 3,
  addresses: {
    BITCOIN:  DEPOSIT_ADDRESSES.BITCOIN,
    ETHEREUM: DEPOSIT_ADDRESSES.EVM,
    BASE:     DEPOSIT_ADDRESSES.EVM,
    OPTIMISM: DEPOSIT_ADDRESSES.EVM,
    ARBITRUM: DEPOSIT_ADDRESSES.EVM,
    BSC:      DEPOSIT_ADDRESSES.EVM,
    SOLANA:   DEPOSIT_ADDRESSES.SOLANA,
    XRP:      DEPOSIT_ADDRESSES.XRP,
    TON:      DEPOSIT_ADDRESSES.TON,
    LUX:      DEPOSIT_ADDRESSES.LUX,
  }
};

export const CYRUS_CHAINS: ChainConfig[] = [
  {
    id: 'BITCOIN', name: 'Bitcoin', symbol: 'BTC', chainId: null, type: 'bitcoin',
    color: '#F7931A', icon: '/images/tokens/bitcoin.png', explorer: 'https://btcscan.org',
    nativeAsset: 'BTC', decimals: 8, enabled: true, depositAddress: DEPOSIT_ADDRESSES.BITCOIN,
  },
  {
    id: 'ETHEREUM', name: 'Ethereum', symbol: 'ETH', chainId: 1, type: 'evm',
    color: '#627EEA', icon: '/images/tokens/ethereum.png', explorer: 'https://etherscan.io',
    rpc: 'https://eth.llamarpc.com', nativeAsset: 'ETH', decimals: 18, enabled: true,
    depositAddress: DEPOSIT_ADDRESSES.EVM,
  },
  {
    id: 'BASE', name: 'Base', symbol: 'ETH', chainId: 8453, type: 'evm',
    color: '#0052FF', icon: '/images/tokens/base.png', explorer: 'https://basescan.org',
    rpc: 'https://mainnet.base.org', nativeAsset: 'ETH', decimals: 18, enabled: true,
    depositAddress: DEPOSIT_ADDRESSES.EVM,
  },
  {
    id: 'OPTIMISM', name: 'Optimism', symbol: 'ETH', chainId: 10, type: 'evm',
    color: '#FF0420', icon: '/images/tokens/ethereum.png', explorer: 'https://optimistic.etherscan.io',
    rpc: 'https://mainnet.optimism.io', nativeAsset: 'ETH', decimals: 18, enabled: true,
    depositAddress: DEPOSIT_ADDRESSES.EVM,
  },
  {
    id: 'ARBITRUM', name: 'Arbitrum', symbol: 'ETH', chainId: 42161, type: 'evm',
    color: '#28A0F0', icon: '/images/tokens/ethereum.png', explorer: 'https://arbiscan.io',
    rpc: 'https://arb1.arbitrum.io/rpc', nativeAsset: 'ETH', decimals: 18, enabled: true,
    depositAddress: DEPOSIT_ADDRESSES.EVM,
  },
  {
    id: 'BSC', name: 'BNB Chain', symbol: 'BNB', chainId: 56, type: 'evm',
    color: '#F0B90B', icon: '/images/tokens/bnb.png', explorer: 'https://bscscan.com',
    rpc: 'https://bsc-dataseed.binance.org', nativeAsset: 'BNB', decimals: 18, enabled: true,
    depositAddress: DEPOSIT_ADDRESSES.EVM,
  },
  {
    id: 'SOLANA', name: 'Solana', symbol: 'SOL', chainId: null, type: 'solana',
    color: '#9945FF', icon: '/images/tokens/solana.png', explorer: 'https://explorer.solana.com',
    rpc: 'https://api.mainnet-beta.solana.com', nativeAsset: 'SOL', decimals: 9, enabled: true,
    depositAddress: DEPOSIT_ADDRESSES.SOLANA, minAmount: 0.05,
  },
  {
    id: 'XRP', name: 'XRP Ledger', symbol: 'XRP', chainId: null, type: 'xrp',
    color: '#346AA9', icon: '/images/tokens/xrp.png', explorer: 'https://xrpscan.com',
    nativeAsset: 'XRP', decimals: 6, enabled: true,
    depositAddress: DEPOSIT_ADDRESSES.XRP, memo: DEPOSIT_ADDRESSES.XRP_MEMO,
  },
  {
    id: 'TON', name: 'TON', symbol: 'TON', chainId: -239, type: 'ton',
    color: '#0088CC', icon: '/images/tokens/ton.png', explorer: 'https://tonscan.org',
    nativeAsset: 'TON', decimals: 9, enabled: true,
    depositAddress: DEPOSIT_ADDRESSES.TON, memo: DEPOSIT_ADDRESSES.TON_MEMO,
  },
  {
    id: 'LUX', name: 'Lux', symbol: 'LUX', chainId: 96369, type: 'evm',
    color: '#C9A227', icon: '/images/tokens/lux.png', explorer: 'https://explore.lux.network',
    rpc: 'https://api.lux.network', nativeAsset: 'LUX', decimals: 18, enabled: true,
    depositAddress: DEPOSIT_ADDRESSES.LUX,
  },
];

export const MINT_ASSETS: Record<string, DonationAsset[]> = {
  BITCOIN: [
    { symbol: 'BTC', name: 'Bitcoin', decimals: 8, logo: '/images/tokens/bitcoin.png', enabled: true },
  ],
  ETHEREUM: [
    { symbol: 'ETH', name: 'Ethereum', decimals: 18, logo: '/images/tokens/ethereum.png', enabled: true },
    { symbol: 'USDC', name: 'USD Coin', decimals: 6, contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', logo: '/images/tokens/ethereum.png', enabled: true },
    { symbol: 'USDT', name: 'Tether', decimals: 6, contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7', logo: '/images/tokens/ethereum.png', enabled: true },
  ],
  BASE: [
    { symbol: 'ETH', name: 'Ethereum', decimals: 18, logo: '/images/tokens/ethereum.png', enabled: true },
    { symbol: 'USDC', name: 'USD Coin', decimals: 6, contractAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', logo: '/images/tokens/ethereum.png', enabled: true },
  ],
  OPTIMISM: [
    { symbol: 'ETH', name: 'Ethereum', decimals: 18, logo: '/images/tokens/ethereum.png', enabled: true },
    { symbol: 'USDC', name: 'USD Coin', decimals: 6, contractAddress: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85', logo: '/images/tokens/ethereum.png', enabled: true },
  ],
  ARBITRUM: [
    { symbol: 'ETH', name: 'Ethereum', decimals: 18, logo: '/images/tokens/ethereum.png', enabled: true },
    { symbol: 'USDC', name: 'USD Coin', decimals: 6, contractAddress: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', logo: '/images/tokens/ethereum.png', enabled: true },
  ],
  BSC: [
    { symbol: 'BNB', name: 'BNB', decimals: 18, logo: '/images/tokens/bnb.png', enabled: true },
  ],
  SOLANA: [
    { symbol: 'SOL', name: 'Solana', decimals: 9, logo: '/images/tokens/solana.png', enabled: true, minAmount: 0.05 },
    { symbol: 'USDC', name: 'USD Coin', decimals: 6, contractAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', logo: '/images/tokens/solana.png', enabled: true },
  ],
  XRP: [
    { symbol: 'XRP', name: 'XRP', decimals: 6, logo: '/images/tokens/xrp.png', enabled: true },
  ],
  TON: [
    { symbol: 'TON', name: 'TON', decimals: 9, logo: '/images/tokens/ton.png', enabled: true },
  ],
  LUX: [
    { symbol: 'LUX', name: 'Lux', decimals: 18, logo: '/images/tokens/lux.png', enabled: true },
  ],
};

export const getChain = (chainId: string): ChainConfig | undefined => CYRUS_CHAINS.find(c => c.id === chainId);
export const getChainAssets = (chainId: string): DonationAsset[] => MINT_ASSETS[chainId] || [];
export const getEnabledChains = (): ChainConfig[] => CYRUS_CHAINS.filter(c => c.enabled);
