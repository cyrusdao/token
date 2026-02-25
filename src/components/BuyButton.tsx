import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAccount, useConnect, useWriteContract, useReadContract, useWaitForTransactionReceipt, useSwitchChain, useChainId } from 'wagmi';
import { base } from 'wagmi/chains';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CYRUS_ADDRESS, CYRUS_ABI, USDT_ADDRESS, USDT_ABI } from '@/lib/wagmi';
import { Crown, Loader2, Check, Wallet, AlertCircle, ExternalLink, TrendingUp, Sparkles, Droplets } from 'lucide-react';
import { formatUnits, parseUnits } from 'viem';

// USDT has 6 decimals
const USDT_DECIMALS = 6;
const CYRUS_DECIMALS = 18;

// Environment check
const IS_LOCAL = import.meta.env.VITE_LOCAL === 'true';
const EXPECTED_CHAIN_ID = IS_LOCAL ? 31337 : base.id;

export default function BuyButton() {
  const { t } = useTranslation();
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [mounted, setMounted] = useState(false);
  const [usdtAmount, setUsdtAmount] = useState('10');
  const [step, setStep] = useState<'idle' | 'approving' | 'buying'>('idle');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Get current price in USDT (6 decimals)
  const { data: currentPrice } = useReadContract({
    address: CYRUS_ADDRESS,
    abi: CYRUS_ABI,
    functionName: 'getCurrentPrice',
  });

  // Get start and end prices
  const { data: startPrice } = useReadContract({
    address: CYRUS_ADDRESS,
    abi: CYRUS_ABI,
    functionName: 'START_PRICE',
  });

  const { data: endPrice } = useReadContract({
    address: CYRUS_ADDRESS,
    abi: CYRUS_ABI,
    functionName: 'END_PRICE',
  });

  // Get tokens sold
  const { data: tokensSold } = useReadContract({
    address: CYRUS_ADDRESS,
    abi: CYRUS_ABI,
    functionName: 'tokensSold',
  });

  // Get sale supply
  const { data: saleSupply } = useReadContract({
    address: CYRUS_ADDRESS,
    abi: CYRUS_ABI,
    functionName: 'SALE_SUPPLY',
  });

  // Check if sale is active
  const { data: saleActive } = useReadContract({
    address: CYRUS_ADDRESS,
    abi: CYRUS_ABI,
    functionName: 'saleActive',
  });

  // Get USDT raised
  const { data: usdtRaised } = useReadContract({
    address: CYRUS_ADDRESS,
    abi: CYRUS_ABI,
    functionName: 'usdtRaised',
  });

  // Calculate tokens for USDT amount
  const parsedUsdtAmount = usdtAmount ? parseUnits(usdtAmount || '0', USDT_DECIMALS) : BigInt(0);
  const { data: tokensToReceive } = useReadContract({
    address: CYRUS_ADDRESS,
    abi: CYRUS_ABI,
    functionName: 'calculateTokensForUsdt',
    args: [parsedUsdtAmount],
  });

  // Get user's CYRUS balance
  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: CYRUS_ADDRESS,
    abi: CYRUS_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  // Get user's USDT balance
  const { data: usdtBalance } = useReadContract({
    address: USDT_ADDRESS,
    abi: USDT_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  // Check USDT allowance
  const { data: usdtAllowance, refetch: refetchAllowance } = useReadContract({
    address: USDT_ADDRESS,
    abi: USDT_ABI,
    functionName: 'allowance',
    args: address ? [address, CYRUS_ADDRESS] : undefined,
  });

  // Write contracts
  const { writeContract: writeApprove, data: approveHash, isPending: isApprovePending, error: approveError, reset: resetApprove } = useWriteContract();
  const { writeContract: writeBuy, data: buyHash, isPending: isBuyPending, error: buyError, reset: resetBuy } = useWriteContract();
  const { writeContract: writeFaucet, isPending: isFaucetPending } = useWriteContract();

  // Wait for transactions
  const { isLoading: isApproveConfirming, isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({
    hash: approveHash,
  });

  const { isLoading: isBuyConfirming, isSuccess: isBuySuccess } = useWaitForTransactionReceipt({
    hash: buyHash,
  });

  // Handle approve success -> trigger buy
  useEffect(() => {
    if (isApproveSuccess && step === 'approving') {
      refetchAllowance();
      setStep('buying');
      writeBuy({
        address: CYRUS_ADDRESS,
        abi: CYRUS_ABI,
        functionName: 'buy',
        args: [parsedUsdtAmount],
      });
    }
  }, [isApproveSuccess, step]);

  // Refetch data after successful buy
  useEffect(() => {
    if (isBuySuccess) {
      refetchBalance();
      refetchAllowance();
      setStep('idle');
    }
  }, [isBuySuccess, refetchBalance, refetchAllowance]);

  // Check if we need approval
  const needsApproval = usdtAllowance !== undefined && parsedUsdtAmount > BigInt(0) && usdtAllowance < parsedUsdtAmount;

  // Faucet for local testing
  const handleFaucet = () => {
    writeFaucet({
      address: USDT_ADDRESS,
      abi: USDT_ABI,
      functionName: 'faucet',
    });
  };

  const handleBuy = () => {
    if (!usdtAmount || parseFloat(usdtAmount) <= 0) return;

    resetApprove();
    resetBuy();

    if (needsApproval) {
      setStep('approving');
      writeApprove({
        address: USDT_ADDRESS,
        abi: USDT_ABI,
        functionName: 'approve',
        args: [CYRUS_ADDRESS, parsedUsdtAmount],
      });
    } else {
      setStep('buying');
      writeBuy({
        address: CYRUS_ADDRESS,
        abi: CYRUS_ABI,
        functionName: 'buy',
        args: [parsedUsdtAmount],
      });
    }
  };

  // Calculate sale progress (quadratic curve visualization)
  const progress = tokensSold && saleSupply
    ? (Number(formatUnits(tokensSold, CYRUS_DECIMALS)) / Number(formatUnits(saleSupply, CYRUS_DECIMALS))) * 100
    : 0;

  // Format price as USD
  const formattedPrice = currentPrice
    ? `$${Number(formatUnits(currentPrice, USDT_DECIMALS)).toFixed(4)}`
    : '$0.01';

  const formattedTokens = tokensToReceive
    ? Number(formatUnits(tokensToReceive, CYRUS_DECIMALS)).toLocaleString(undefined, { maximumFractionDigits: 2 })
    : '0';

  const formattedUsdtBalance = usdtBalance
    ? Number(formatUnits(usdtBalance, USDT_DECIMALS)).toLocaleString(undefined, { maximumFractionDigits: 2 })
    : '0';

  const formattedUsdtRaised = usdtRaised
    ? Number(formatUnits(usdtRaised, USDT_DECIMALS)).toLocaleString(undefined, { maximumFractionDigits: 0 })
    : '0';

  const isPending = isApprovePending || isBuyPending;
  const isConfirming = isApproveConfirming || isBuyConfirming;
  const error = approveError || buyError;
  const hash = buyHash || approveHash;

  if (!mounted) {
    return (
      <div className="w-full max-w-md mx-auto p-6 rounded-2xl bg-gradient-to-br from-amber-900/50 to-yellow-900/30 border border-amber-500/30">
        <Button size="lg" disabled className="w-full h-14 text-lg font-bold bg-gradient-to-r from-amber-600 to-yellow-500">
          <Crown className="w-6 h-6 mr-2" />
          Buy CYRUS
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 rounded-2xl bg-gradient-to-br from-amber-900/50 to-yellow-900/30 border border-amber-500/30 backdrop-blur-sm">
      {/* Early Buyer Banner */}
      <div className="mb-4 p-3 rounded-lg bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-400/30">
        <div className="flex items-center justify-center gap-2 text-amber-300">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">{t('buyButton.earlyBuyers')}</span>
          <Sparkles className="w-4 h-4" />
        </div>
      </div>

      {/* Price Info */}
      <div className="mb-6 text-center">
        <div className="flex items-center justify-center gap-2 text-amber-400 mb-2">
          <TrendingUp className="w-5 h-5" />
          <span className="text-sm font-medium">{t('buyButton.bondingCurve')}</span>
        </div>
        <p className="text-3xl font-bold text-white">
          {formattedPrice}
        </p>
        <p className="text-sm text-amber-300/70">{t('buyButton.perToken')}</p>
        <p className="text-xs text-amber-300/50 mt-1">
          {t('buyButton.priceRange')}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-amber-300/70 mb-2">
          <span>{progress.toFixed(2)}% {t('buyButton.sold')}</span>
          <span>${formattedUsdtRaised} {t('buyButton.raised')}</span>
        </div>
        <div className="h-3 bg-amber-950 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-600 to-yellow-400 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-amber-300/50 mt-1">
          <span>$0.01</span>
          <span>$1.00</span>
        </div>
      </div>

      {/* Not connected */}
      {!isConnected ? (
        <Button
          size="lg"
          onClick={() => connect({ connector: connectors[0] })}
          className="w-full h-14 text-lg font-bold bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 border-0 shadow-lg shadow-amber-500/25"
        >
          <Wallet className="w-6 h-6 mr-2" />
          {t('buyButton.connectWallet')}
        </Button>
      ) : chainId !== EXPECTED_CHAIN_ID ? (
        /* Wrong network */
        <Button
          size="lg"
          onClick={() => switchChain({ chainId: EXPECTED_CHAIN_ID })}
          className="w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400"
        >
          <AlertCircle className="w-6 h-6 mr-2" />
          {t('buyButton.switchTo')} {IS_LOCAL ? 'Localhost' : 'Base'}
        </Button>
      ) : !saleActive ? (
        /* Sale not active */
        <Button size="lg" disabled className="w-full h-14 text-lg font-bold bg-gray-600">
          {t('buyButton.saleComplete')}
        </Button>
      ) : isPending || isConfirming ? (
        /* Transaction pending */
        <Button size="lg" disabled className="w-full h-14 text-lg font-bold bg-gradient-to-r from-amber-600 to-yellow-500">
          <Loader2 className="w-6 h-6 mr-2 animate-spin" />
          {isApprovePending ? t('buyButton.approveUsdt') :
           isApproveConfirming ? t('buyButton.approving') :
           isBuyPending ? t('buyButton.confirmPurchase') :
           t('buyButton.processing')}
        </Button>
      ) : isBuySuccess && buyHash ? (
        /* Success */
        <div className="text-center">
          <Button size="lg" disabled className="w-full h-14 text-lg font-bold bg-green-600 mb-4">
            <Check className="w-6 h-6 mr-2" />
            {t('buyButton.purchaseComplete')}
          </Button>
          <a
            href={`https://basescan.org/tx/${buyHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300"
          >
            {t('buyButton.viewOnBasescan')} <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      ) : (
        /* Ready to buy */
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-amber-300">
                {t('buyButton.amountUsdt')}
              </label>
              {isConnected && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-amber-300/60">
                    {t('buyButton.balance')}: {formattedUsdtBalance} USDT
                  </span>
                  {IS_LOCAL && (
                    <button
                      onClick={handleFaucet}
                      disabled={isFaucetPending}
                      className="text-xs px-2 py-0.5 rounded bg-green-600/80 hover:bg-green-500 text-white transition-colors flex items-center gap-1"
                    >
                      <Droplets className="w-3 h-3" />
                      {isFaucetPending ? '...' : t('buyButton.faucet')}
                    </button>
                  )}
                </div>
              )}
            </div>
            <Input
              type="number"
              value={usdtAmount}
              onChange={(e) => setUsdtAmount(e.target.value)}
              placeholder="10"
              step="1"
              min="0"
              className="bg-amber-950/50 border-amber-500/30 text-white text-lg h-12"
            />
          </div>

          <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-500/20">
            <p className="text-sm text-amber-300/70">{t('buyButton.willReceive')}</p>
            <p className="text-xl font-bold text-white">{formattedTokens} CYRUS</p>
          </div>

          <Button
            size="lg"
            onClick={handleBuy}
            disabled={!usdtAmount || parseFloat(usdtAmount) <= 0}
            className="w-full h-14 text-lg font-bold bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 border-0 shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.02]"
          >
            <Crown className="w-6 h-6 mr-2" />
            {needsApproval ? t('buyButton.approveAndBuy') : t('common.buyCyrus')}
          </Button>

          {error && (
            <p className="text-red-400 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error.message.includes('rejected') ? t('buyButton.transactionRejected') : t('buyButton.errorOccurred')}
            </p>
          )}
        </div>
      )}

      {/* Balance display */}
      {isConnected && balance && (
        <div className="mt-4 pt-4 border-t border-amber-500/20 text-center">
          <p className="text-sm text-amber-300/70">{t('buyButton.yourBalance')}</p>
          <p className="text-lg font-bold text-white">
            {Number(formatUnits(balance, CYRUS_DECIMALS)).toLocaleString()} CYRUS
          </p>
        </div>
      )}
    </div>
  );
}
