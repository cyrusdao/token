// Cyrus DAO - Supported Networks for Presale
// 3 native chains: BTC, ETH, SOL
// CYRUS claimable on Pars Network after mint date (Nowruz, March 20)

import type { ChainConfig, DAOWalletConfig, DonationAsset } from './types';

const DEPOSIT_ADDRESSES = {
  BITCOIN: '3CUTagummxA2SMFrS2vxGKyLj4gtQ9mrbW',
  EVM:     '0xC8C581EDeB8d739F1Daf2D508C3B9CB4e0E051eF', // ETH, Base, Optimism, Arbitrum
  SOLANA:  '3CQYt4bCfGNyetaE3z6i3xv3RVirYqak9KtkpMJeii6M',
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
    SOLANA:   DEPOSIT_ADDRESSES.SOLANA,
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
    id: 'SOLANA', name: 'Solana', symbol: 'SOL', chainId: null, type: 'solana',
    color: '#9945FF', icon: '/images/tokens/solana.png', explorer: 'https://explorer.solana.com',
    rpc: 'https://api.mainnet-beta.solana.com', nativeAsset: 'SOL', decimals: 9, enabled: true,
    depositAddress: DEPOSIT_ADDRESSES.SOLANA, minAmount: 0.05,
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
  SOLANA: [
    { symbol: 'SOL', name: 'Solana', decimals: 9, logo: '/images/tokens/solana.png', enabled: true, minAmount: 0.05 },
    { symbol: 'USDC', name: 'USD Coin', decimals: 6, contractAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', logo: '/images/tokens/solana.png', enabled: true },
  ],
};

export const getChain = (chainId: string): ChainConfig | undefined => CYRUS_CHAINS.find(c => c.id === chainId);
export const getChainAssets = (chainId: string): DonationAsset[] => MINT_ASSETS[chainId] || [];
export const getEnabledChains = (): ChainConfig[] => CYRUS_CHAINS.filter(c => c.enabled);
