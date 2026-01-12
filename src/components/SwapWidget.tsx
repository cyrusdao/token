import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useReadContract } from 'wagmi';
import { ExternalLink, ArrowRightLeft, TrendingUp, TrendingDown, Loader2, BarChart3 } from 'lucide-react';
import { formatUnits } from 'viem';
import { CYRUS_ADDRESS, CYRUS_ABI, TRADING_LINKS } from '@/lib/wagmi';

const USDT_DECIMALS = 6;

// DexScreener API for price fetching
const DEXSCREENER_API = `https://api.dexscreener.com/latest/dex/tokens/${CYRUS_ADDRESS}`;

interface DexPair {
  priceUsd: string;
  volume24h: number;
  liquidity: { usd: number };
  dexId: string;
}

export default function SwapWidget() {
  const { t } = useTranslation();
  const [dexPrice, setDexPrice] = useState<number | null>(null);
  const [dexVolume, setDexVolume] = useState<number | null>(null);
  const [dexLiquidity, setDexLiquidity] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get current bonding curve price
  const { data: currentPrice } = useReadContract({
    address: CYRUS_ADDRESS,
    abi: CYRUS_ABI,
    functionName: 'getCurrentPrice',
  });

  // Fetch DEX price from DexScreener
  useEffect(() => {
    const fetchDexPrice = async () => {
      // Skip if contract address is not deployed yet (zeros)
      if (CYRUS_ADDRESS === '0x0000000000000000000000000000000000000000') {
        setIsLoading(false);
        setError('not_deployed');
        return;
      }

      try {
        const response = await fetch(DEXSCREENER_API);
        const data = await response.json();

        if (data.pairs && data.pairs.length > 0) {
          // Get the pair with highest liquidity
          const bestPair = data.pairs.reduce((best: DexPair, pair: DexPair) =>
            (pair.liquidity?.usd || 0) > (best.liquidity?.usd || 0) ? pair : best
          );

          setDexPrice(parseFloat(bestPair.priceUsd));
          setDexVolume(bestPair.volume24h || 0);
          setDexLiquidity(bestPair.liquidity?.usd || 0);
        } else {
          setError('no_pairs');
        }
      } catch (err) {
        setError('fetch_failed');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDexPrice();
    // Refresh every 30 seconds
    const interval = setInterval(fetchDexPrice, 30000);
    return () => clearInterval(interval);
  }, []);

  // Calculate bonding curve price in USD
  const bondingPrice = currentPrice
    ? Number(formatUnits(currentPrice, USDT_DECIMALS))
    : 0.01; // Default start price

  // Calculate arbitrage opportunity
  const priceDiff = dexPrice !== null ? ((dexPrice - bondingPrice) / bondingPrice) * 100 : null;
  const hasArbitrage = priceDiff !== null && Math.abs(priceDiff) > 1; // More than 1% difference

  // Determine which is cheaper
  const bondingCheaper = priceDiff !== null && priceDiff > 0;
  const discount = priceDiff !== null ? Math.abs(priceDiff).toFixed(1) : '0';

  // Contract not deployed yet - show coming soon
  if (error === 'not_deployed') {
    return (
      <div className="w-full max-w-md mx-auto p-6 rounded-2xl bg-gradient-to-br from-blue-900/50 to-indigo-900/30 border border-blue-500/30 backdrop-blur-sm">
        <div className="text-center">
          <ArrowRightLeft className="w-10 h-10 text-blue-400 mx-auto mb-3" />
          <h3 className="font-display text-lg text-white mb-2">{t('swap.dexTrading')}</h3>
          <p className="text-sm text-blue-300/70 mb-4">{t('swap.comingSoon')}</p>
          <div className="p-3 rounded-lg bg-blue-950/30 border border-blue-500/20">
            <p className="text-xs text-blue-300/60">{t('swap.afterLaunch')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 rounded-2xl bg-gradient-to-br from-blue-900/50 to-indigo-900/30 border border-blue-500/30 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-center gap-2 text-blue-400 mb-4">
        <ArrowRightLeft className="w-5 h-5" />
        <span className="text-sm font-medium">{t('swap.dexTrading')}</span>
      </div>

      {/* Price Comparison */}
      {isLoading ? (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
        </div>
      ) : dexPrice !== null ? (
        <>
          {/* Current DEX Price */}
          <div className="text-center mb-4">
            <p className="text-3xl font-bold text-white">
              ${dexPrice.toFixed(4)}
            </p>
            <p className="text-sm text-blue-300/70">{t('swap.dexPrice')}</p>
          </div>

          {/* Arbitrage Indicator */}
          {hasArbitrage && (
            <div className={`mb-4 p-3 rounded-lg border ${
              bondingCheaper
                ? 'bg-green-500/10 border-green-500/30'
                : 'bg-amber-500/10 border-amber-500/30'
            }`}>
              <div className="flex items-center justify-center gap-2">
                {bondingCheaper ? (
                  <>
                    <TrendingDown className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-medium text-green-300">
                      {t('swap.bondingCheaper', { discount })}
                    </span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-medium text-amber-300">
                      {t('swap.dexCheaper', { discount })}
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs text-center mt-1 text-muted-foreground">
                {bondingCheaper ? t('swap.mintForDiscount') : t('swap.buyOnDex')}
              </p>
            </div>
          )}

          {/* Price Comparison Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-500/20 text-center">
              <p className="text-xs text-amber-300/60 mb-1">{t('swap.bondingPrice')}</p>
              <p className="text-lg font-bold text-amber-300">${bondingPrice.toFixed(4)}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-950/30 border border-blue-500/20 text-center">
              <p className="text-xs text-blue-300/60 mb-1">{t('swap.uniswapPrice')}</p>
              <p className="text-lg font-bold text-blue-300">${dexPrice.toFixed(4)}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-between text-xs text-muted-foreground mb-4">
            <span>{t('swap.volume24h')}: ${dexVolume?.toLocaleString() || '0'}</span>
            <span>{t('swap.liquidity')}: ${dexLiquidity?.toLocaleString() || '0'}</span>
          </div>
        </>
      ) : (
        <div className="text-center py-4">
          <BarChart3 className="w-8 h-8 text-blue-400/50 mx-auto mb-2" />
          <p className="text-sm text-blue-300/70">{t('swap.noPairs')}</p>
        </div>
      )}

      {/* Trade on Uniswap Button */}
      <a
        href={TRADING_LINKS.uniswap}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full h-12 text-base font-bold bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 rounded-lg text-white transition-all hover:scale-[1.02]"
      >
        <ArrowRightLeft className="w-5 h-5" />
        {t('swap.tradeOnUniswap')}
        <ExternalLink className="w-4 h-4" />
      </a>

      {/* Additional Links */}
      <div className="flex justify-center gap-4 mt-4">
        <a
          href={TRADING_LINKS.dexscreener}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
        >
          DexScreener <ExternalLink className="w-3 h-3" />
        </a>
        <a
          href={TRADING_LINKS.basescan}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
        >
          Basescan <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
