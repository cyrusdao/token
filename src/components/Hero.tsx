import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronDown, Coins, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";
import CyrusCoin3D from "./CyrusCoin3D";

const Hero = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "fa";
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-visible bg-background">
      {/* Ambient gradient glow */}
      <div className="absolute inset-0 bg-gradient-hero" />
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 geometric-pattern opacity-50" />

      {/* 3D Coin - Background layer - always on flex-end (right in LTR, left in RTL) */}
      <div className="absolute inset-0 pointer-events-auto z-0 overflow-visible">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="absolute inset-0 flex items-center justify-end overflow-visible"
        >
          <div className="w-[55%] h-full translate-x-[35%]">
            <CyrusCoin3D />
          </div>
        </motion.div>
      </div>

      {/* Content - always on flex-start (left in LTR, right in RTL) */}
      <div className={`relative z-10 w-full min-h-screen flex items-center justify-start pt-24 pb-16 pointer-events-none ${isRTL ? 'pr-6 lg:pr-12' : 'pl-6 lg:pl-12'}`}>
        <div className={`max-w-lg ${isRTL ? 'text-right' : 'text-left'}`}>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`mb-6 ${isRTL ? 'flex justify-end' : ''}`}
          >
            <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.15em] uppercase text-muted-foreground glass glass-border px-4 py-2 rounded-full pointer-events-auto">
              <span className="w-1.5 h-1.5 rounded-full bg-pahlavi-emerald animate-pulse" />
              {t("hero.badge")}
            </span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="font-display text-5xl md:text-6xl lg:text-7xl text-foreground mb-6 leading-[1.05] tracking-wide text-balance drop-shadow-lg"
          >
            {t("hero.title1")}
            <br />
            <span className="text-gradient-gold">{t("hero.title2")}</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="max-w-xl text-muted-foreground text-lg md:text-xl mb-8 font-sans leading-relaxed drop-shadow-md"
          >
            {t("hero.description")}
          </motion.p>

          {/* Token info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className={`flex flex-wrap gap-6 mb-10 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}
          >
            {[
              { value: "1B", label: t("hero.supply") },
              { value: "Base", label: t("hero.blockchain") },
              { value: "100%", label: t("hero.diaspora") },
              { value: "50%", label: t("hero.daoSecured") },
            ].map((stat) => (
              <div key={stat.label} className={isRTL ? 'text-right' : 'text-left'}>
                <div className="font-display text-2xl md:text-3xl text-foreground tracking-wide drop-shadow-md">
                  {stat.value}
                </div>
                <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-muted-foreground mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className={`flex flex-col sm:flex-row gap-4 pointer-events-auto ${isRTL ? 'sm:flex-row-reverse sm:justify-end' : ''}`}
          >
            <Button variant="hero" size="lg" onClick={() => document.getElementById('buy')?.scrollIntoView({ behavior: 'smooth' })}>
              <Coins className="w-5 h-5" />
              {t("common.buyCyrus")}
            </Button>
            <Button variant="hero-outline" size="lg" className="border-2 border-foreground/40 hover:border-foreground/70" onClick={() => window.open(isRTL ? '/whitepaper-fa.pdf' : '/whitepaper.pdf', '_blank')}>
              <FileText className="w-5 h-5" />
              {t("common.readWhitepaper")}
            </Button>
          </motion.div>
          
          {/* Disclaimer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className={`mt-6 text-[11px] text-muted-foreground/60 max-w-md ${isRTL ? 'mr-0 ml-auto' : ''}`}
          >
            {t("hero.disclaimer")}
          </motion.p>
          </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
            {t("common.scroll")}
          </span>
          <ChevronDown className="text-muted-foreground w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
