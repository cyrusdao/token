// Cyrus DAO - Multi-chain Presale Widget
// 7 chains: Bitcoin, Ethereum, BNB, Solana, XRP, TON, Lux
// Funds go directly to DAO treasury — CYRUS claimable at mint date

import { useState, useMemo } from 'react';
import { ArrowRight, Copy, Check, ExternalLink, Shield, ChevronDown, Wallet, QrCode, Info } from 'lucide-react';
import { CYRUS_CHAINS, MINT_ASSETS, CYRUS_DAO_WALLET, getChainAssets } from './networks';
import type { ChainConfig } from './types';

interface CyrusBridgeProps {
  className?: string;
  compact?: boolean;
  defaultChain?: string;
}

export function CyrusBridge({ className = '', compact = false, defaultChain = 'SOLANA' }: CyrusBridgeProps) {
  const [selectedChain, setSelectedChain] = useState<string>(defaultChain);
  const [selectedAsset, setSelectedAsset] = useState<string>('');
  const [showChainDropdown, setShowChainDropdown] = useState(false);
  const [showAssetDropdown, setShowAssetDropdown] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const chain = useMemo(() => CYRUS_CHAINS.find(c => c.id === selectedChain), [selectedChain]);
  const assets = useMemo(() => getChainAssets(selectedChain), [selectedChain]);
  const asset = useMemo(() => assets.find(a => a.symbol === selectedAsset) || assets[0], [assets, selectedAsset]);

  const depositAddress = chain?.depositAddress || CYRUS_DAO_WALLET.addresses[selectedChain] || '';
  const hasAddress = !!depositAddress;

  const copyAddress = async () => {
    if (!hasAddress) return;
    await navigator.clipboard.writeText(depositAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openExplorer = () => {
    if (!chain || !hasAddress) return;
    window.open(`${chain.explorer}/address/${depositAddress}`, '_blank', 'noopener,noreferrer');
  };

  const handleChainChange = (chainId: string) => {
    setSelectedChain(chainId);
    const chainAssets = getChainAssets(chainId);
    setSelectedAsset(chainAssets[0]?.symbol || '');
    setShowChainDropdown(false);
  };

  return (
    <div className={`bg-amber-950/30 border border-amber-500/30 rounded-xl backdrop-blur-sm ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-amber-500/20">
        <div className="flex items-center gap-2">
          <Wallet className="text-amber-400" size={20} />
          <h3 className="text-base font-medium text-white">Get CYRUS</h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-amber-300/60">
          <Shield size={14} className="text-emerald-500" />
          <span>{CYRUS_DAO_WALLET.threshold}-of-{CYRUS_DAO_WALLET.signers} Multi-sig</span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Chain Selector */}
        <div>
          <label className="text-xs text-amber-300/60 mb-2 block">Select Chain</label>
          <div className="relative">
            <button
              onClick={() => setShowChainDropdown(!showChainDropdown)}
              className="w-full flex items-center justify-between p-3 bg-amber-950/50 border border-amber-500/20 rounded-lg hover:border-amber-500/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                {chain && (
                  <>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${chain.color}20` }}>
                      <img src={chain.icon} alt={chain.name} className="w-5 h-5 rounded-full" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-white">{chain.name}</p>
                      <p className="text-xs text-amber-300/50">{chain.symbol}</p>
                    </div>
                  </>
                )}
              </div>
              <ChevronDown size={18} className="text-amber-300/50" />
            </button>

            {showChainDropdown && (
              <div className="absolute z-20 w-full mt-2 bg-[#1a0f00] border border-amber-500/20 rounded-lg shadow-xl overflow-hidden max-h-64 overflow-y-auto">
                {CYRUS_CHAINS.filter(c => c.enabled).map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleChainChange(c.id)}
                    className={`w-full flex items-center gap-3 p-3 hover:bg-amber-500/10 transition-colors ${c.id === selectedChain ? 'bg-amber-500/10' : ''}`}
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${c.color}20` }}>
                      <img src={c.icon} alt={c.name} className="w-5 h-5 rounded-full" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-white">{c.name}</p>
                      <p className="text-xs text-amber-300/50">{c.symbol}</p>
                    </div>
                    {c.id === selectedChain && <Check size={16} className="ml-auto text-amber-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Asset Selector */}
        {!compact && assets.length > 1 && (
          <div>
            <label className="text-xs text-amber-300/60 mb-2 block">Select Asset</label>
            <div className="relative">
              <button
                onClick={() => setShowAssetDropdown(!showAssetDropdown)}
                className="w-full flex items-center justify-between p-3 bg-amber-950/50 border border-amber-500/20 rounded-lg hover:border-amber-500/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {asset && (
                    <>
                      <img src={asset.logo} alt={asset.symbol} className="w-6 h-6 rounded-full" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                      <div className="text-left">
                        <p className="text-sm font-medium text-white">{asset.symbol}</p>
                        <p className="text-xs text-amber-300/50">{asset.name}</p>
                      </div>
                    </>
                  )}
                </div>
                <ChevronDown size={18} className="text-amber-300/50" />
              </button>

              {showAssetDropdown && (
                <div className="absolute z-20 w-full mt-2 bg-[#1a0f00] border border-amber-500/20 rounded-lg shadow-xl overflow-hidden">
                  {assets.filter(a => a.enabled).map((a) => (
                    <button
                      key={a.symbol}
                      onClick={() => { setSelectedAsset(a.symbol); setShowAssetDropdown(false); }}
                      className={`w-full flex items-center gap-3 p-3 hover:bg-amber-500/10 transition-colors ${a.symbol === (asset?.symbol || '') ? 'bg-amber-500/10' : ''}`}
                    >
                      <img src={a.logo} alt={a.symbol} className="w-6 h-6 rounded-full" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                      <div className="text-left">
                        <p className="text-sm font-medium text-white">{a.symbol}</p>
                        <p className="text-xs text-amber-300/50">{a.name}</p>
                      </div>
                      {a.symbol === (asset?.symbol || '') && <Check size={16} className="ml-auto text-amber-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Deposit Address */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-amber-300/60">Treasury Address</label>
            <button onClick={() => setShowQR(!showQR)} className="text-xs text-amber-300/60 hover:text-amber-400 transition-colors flex items-center gap-1">
              <QrCode size={14} />
              {showQR ? 'Hide' : 'Show'} QR
            </button>
          </div>

          {showQR && hasAddress && (
            <div className="flex justify-center p-4 bg-white rounded-lg mb-3">
              <div className="w-32 h-32 bg-neutral-100 rounded flex items-center justify-center text-neutral-400 text-xs text-center p-2">
                Scan with your wallet app
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 p-3 bg-amber-950/50 border border-amber-500/20 rounded-lg">
            <code className="flex-1 text-sm font-mono text-amber-300 break-all">{depositAddress}</code>
            <div className="flex items-center gap-1">
              <button onClick={copyAddress} className="p-2 hover:bg-amber-500/10 rounded transition-colors" title="Copy address">
                {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} className="text-amber-300/60" />}
              </button>
              <button onClick={openExplorer} className="p-2 hover:bg-amber-500/10 rounded transition-colors" title="View on explorer">
                <ExternalLink size={16} className="text-amber-300/60" />
              </button>
            </div>
          </div>

          {/* Memo required for XRP/TON */}
          {chain?.memo && (
            <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-amber-400 font-medium">⚠️ MEMO REQUIRED</label>
                <button
                  onClick={async () => { await navigator.clipboard.writeText(chain.memo!); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                  className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1"
                >
                  <Copy size={12} /> Copy
                </button>
              </div>
              <code className="text-sm font-mono text-amber-300 break-all">{chain.memo}</code>
              <p className="text-xs text-amber-400/70 mt-2">Include this memo or your deposit will be lost!</p>
            </div>
          )}

          {chain?.minAmount && (
            <div className="mt-3 p-2 bg-amber-950/30 border border-amber-500/10 rounded-lg">
              <p className="text-xs text-amber-300/60">
                Minimum deposit: <span className="text-amber-400 font-medium">{chain.minAmount} {chain.symbol}</span>
              </p>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex items-start gap-2 p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg">
          <Info size={16} className="text-amber-400 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-amber-200/80">
            <p className="mb-1">Send <span className="font-medium text-amber-300">{asset?.symbol || chain?.symbol}</span> on <span className="font-medium text-amber-300">{chain?.name}</span> to this address.</p>
            <p className="text-amber-300/50">Funds go directly to the DAO treasury. CYRUS tokens are claimable on Pars Network after the mint date.</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-amber-300/40">
          <Shield size={14} className="text-emerald-500" />
          <span>Multi-sig secured ({CYRUS_DAO_WALLET.threshold}-of-{CYRUS_DAO_WALLET.signers} signers required)</span>
        </div>
      </div>

      {!compact && (
        <div className="p-4 border-t border-amber-500/20">
          <div className="flex items-center justify-center gap-4 text-[10px] text-amber-300/30">
            <a href="/terms" className="hover:text-amber-300/60 transition-colors">Terms</a>
            <span>|</span>
            <a href="/privacy" className="hover:text-amber-300/60 transition-colors">Privacy</a>
          </div>
        </div>
      )}
    </div>
  );
}

export default CyrusBridge;
