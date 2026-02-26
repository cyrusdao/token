export type MPCBackend = 'utila' | 'fireblocks' | 't-chain' | 'threshold-vm' | 'mpc-go';

export interface ChainConfig {
  id: string;
  name: string;
  symbol: string;
  chainId: number | string | null;
  type: 'evm' | 'solana' | 'ton' | 'bitcoin' | 'xrp';
  color: string;
  icon: string;
  explorer: string;
  rpc?: string;
  nativeAsset: string;
  decimals: number;
  enabled: boolean;
  depositAddress?: string;
  memo?: string;
  minAmount?: number;
  isRedemptionNetwork?: boolean;
  isDev?: boolean;
}

export interface DonationAsset {
  symbol: string;
  name: string;
  decimals: number;
  contractAddress?: string;
  logo: string;
  enabled: boolean;
  minAmount?: number;
}

export interface DAOWalletConfig {
  name: string;
  backend: MPCBackend;
  signers: number;
  threshold: number;
  addresses: Record<string, string>;
}
