import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Loader2, TrendingUp, Shield, Lock, Sparkles } from "lucide-react";
import { CyrusBridge } from "./bridge";
import { useTreasury, formatUsd, formatNative, FUND_TARGET } from "@/lib/treasury";
import { getMintPrice, getChainProgress, getChainAllocation, formatCyrus, CHAIN_MAX_USD } from "@/lib/bondingCurve";

const Buy = () => {
  const { t } = useTranslation();
  const { chains, totalUsd, loading } = useTreasury();

  const progressPct = Math.min((totalUsd / FUND_TARGET) * 100, 100);

  return (
    <section id="buy" className="py-24 px-6 relative overflow-hidden bg-gradient-to-b from-background to-amber-950/20">
      <div className="absolute inset-0 geometric-pattern opacity-30" />

      <div className="container mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.15em] uppercase text-amber-400 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Pre-Sale Live
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-foreground mb-4">
            {t("buy.title")} <span className="text-gradient-gold">{t("buy.titleHighlight")}</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Send from any of 7 chains. Funds go directly to the DAO treasury. CYRUS tokens claimable on Pars Network after the mint date.
          </p>

          {/* Total raised stats */}
          <div className="inline-flex items-center gap-6 text-sm mb-6">
            <div className="text-center">
              {loading ? (
                <Loader2 size={24} className="text-amber-400 animate-spin mx-auto mb-1" />
              ) : (
                <p className="text-2xl font-bold text-amber-400">{formatUsd(totalUsd)}</p>
              )}
              <p className="text-amber-300/40 text-xs">Total Raised</p>
            </div>
            <div className="w-px h-8 bg-amber-500/20" />
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{formatUsd(FUND_TARGET)}</p>
              <p className="text-amber-300/40 text-xs">Goal</p>
            </div>
            <div className="w-px h-8 bg-amber-500/20" />
            <div className="text-center">
              <p className="text-2xl font-bold text-white">$0.01</p>
              <p className="text-amber-300/40 text-xs">Starting Price</p>
            </div>
          </div>

          {/* Overall progress bar */}
          <div className="max-w-md mx-auto">
            <div className="h-2 bg-amber-950 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-600 to-yellow-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(progressPct, 0.5)}%` }}
              />
            </div>
            <p className="text-xs text-amber-300/40 mt-1">{progressPct.toFixed(2)}% of goal reached</p>
          </div>
        </motion.div>

        {/* Chain Leaderboard + Bridge Widget */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16"
        >
          {/* Chain Leaderboard */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
              <TrendingUp size={18} className="text-amber-400" />
              Chain Leaderboard
              <span className="text-xs text-amber-300/40 ml-auto">$0.01 → $1.00</span>
            </h3>

            {loading && chains.every(c => c.usdValue === 0) ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 size={24} className="text-amber-400 animate-spin" />
                <span className="text-amber-300/40 text-sm ml-3">Loading balances...</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {chains.map((chainData) => {
                  const price = getMintPrice(chainData.usdValue, chainData.id);
                  const progress = getChainProgress(chainData.usdValue, chainData.id);
                  const allocation = getChainAllocation(chainData.id);
                  const maxUsd = CHAIN_MAX_USD[chainData.id] || 0;

                  return (
                    <div
                      key={chainData.id}
                      className="p-4 bg-amber-950/30 border border-amber-500/20 rounded-xl hover:border-amber-500/40 transition-all"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${chainData.color}20` }}>
                          <img src={chainData.icon} alt={chainData.name} className="w-4 h-4" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        </div>
                        <span className="text-sm font-medium text-white truncate">{chainData.name}</span>
                      </div>

                      <p className="text-lg font-bold text-amber-400 mb-0.5">${price.toFixed(2)}</p>
                      <p className="text-[10px] text-amber-300/40 mb-3">per CYRUS</p>

                      <div className="w-full h-1.5 bg-amber-950 rounded-full overflow-hidden mb-2">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(progress, 0.5)}%`, backgroundColor: chainData.color, opacity: progress > 0 ? 1 : 0.3 }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-amber-300/40">
                        <span>{formatUsd(chainData.usdValue)}</span>
                        <span>/ {formatUsd(maxUsd)}</span>
                      </div>
                      <p className="text-[10px] text-amber-300/20 mt-1">{formatNative(chainData.nativeBalance, chainData.symbol)}</p>
                      {chainData.subChains && (
                        <p className="text-[9px] text-amber-300/15 mt-1">incl. {chainData.subChains.join(', ')}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bridge Widget */}
          <div>
            <CyrusBridge className="sticky top-24" />
          </div>
        </motion.div>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          {[
            { icon: TrendingUp, title: "1. Select Chain", desc: "Choose from 7 supported blockchains. Each chain has its own bonding curve from $0.01 to $1.00." },
            { icon: Shield, title: "2. Send Funds", desc: "Send to the DAO treasury address shown. Funds are secured by 3-of-5 multi-sig." },
            { icon: Sparkles, title: "3. Claim CYRUS", desc: "Claim your CYRUS tokens on Pars Network after the mint date. Your wallet = your proof." },
          ].map((item) => (
            <div key={item.title} className="p-6 rounded-xl bg-amber-950/30 border border-amber-500/20 backdrop-blur-sm">
              <item.icon className="text-amber-400 mb-3" size={22} />
              <h3 className="font-display text-lg text-amber-400 mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Buy;
