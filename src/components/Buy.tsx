import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import BuyButton from "./BuyButton";
import SwapWidget from "./SwapWidget";

const Buy = () => {
  const { t } = useTranslation();

  const infoCards = [
    {
      title: t("buy.payWithUsdt"),
      description: t("buy.payWithUsdtDesc"),
    },
    {
      title: t("buy.quadraticCurve"),
      description: t("buy.quadraticCurveDesc"),
    },
    {
      title: t("buy.noLimits"),
      description: t("buy.noLimitsDesc"),
    },
  ];

  return (
    <section id="buy" className="py-24 px-6 relative overflow-hidden bg-gradient-to-b from-background to-amber-950/20">
      {/* Background decoration */}
      <div className="absolute inset-0 geometric-pattern opacity-30" />

      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.15em] uppercase text-amber-400 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            {t("buy.badge")}
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-foreground mb-4">
            {t("buy.title")} <span className="text-gradient-gold">{t("buy.titleHighlight")}</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t("buy.description")}
          </p>
        </motion.div>

        {/* Bonding Curve + DEX Trading side by side */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col lg:flex-row gap-6 justify-center items-start max-w-4xl mx-auto"
        >
          <BuyButton />
          <SwapWidget />
        </motion.div>

        {/* Info cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto"
        >
          {infoCards.map((item, i) => (
            <div
              key={i}
              className="p-6 rounded-xl bg-amber-950/30 border border-amber-500/20 backdrop-blur-sm"
            >
              <h3 className="font-display text-lg text-amber-400 mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Buy;
