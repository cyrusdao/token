import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Coins } from "lucide-react";
import { useTranslation } from "react-i18next";

const Philosophy = () => {
  const { t } = useTranslation();

  return (
    <section id="philosophy" className="py-32 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-section" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <span className="font-mono text-[11px] tracking-[0.15em] uppercase text-muted-foreground">
              {t("philosophy.badge")}
            </span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mt-4 tracking-wide text-balance">
              {t("philosophy.title")}
              <br />
              <span className="text-gradient-gold">{t("philosophy.titleHighlight")}</span>
            </h2>
          </motion.div>

          {/* Quote block */}
          <motion.blockquote
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative mb-24"
          >
            <div className="text-center">
              <span className="text-6xl text-pahlavi-gold/20 font-display">"</span>
              <p className="font-display text-2xl md:text-3xl lg:text-4xl text-foreground leading-relaxed max-w-4xl mx-auto -mt-8 italic tracking-wide">
                {t("philosophy.quote")}
              </p>
              <div className="mt-8">
                <cite className="not-italic">
                  <span className="text-pahlavi-gold font-display text-lg tracking-wide">
                    {t("philosophy.quoteAuthor")}
                  </span>
                  <span className="block font-mono text-[10px] tracking-[0.15em] uppercase text-muted-foreground mt-2">
                    {t("philosophy.quoteSource")}
                  </span>
                </cite>
              </div>
            </div>
          </motion.blockquote>

          {/* Philosophy content */}
          <div className="grid md:grid-cols-2 gap-16 md:gap-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h3 className="font-display text-2xl text-foreground mb-6 tracking-wide">
                {t("philosophy.legacyTitle")}
              </h3>
              <div className="space-y-4 text-muted-foreground font-sans text-base leading-relaxed">
                <p>{t("philosophy.legacyP1")}</p>
                <p>{t("philosophy.legacyP2")}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h3 className="font-display text-2xl text-foreground mb-6 tracking-wide">
                {t("philosophy.blockchainTitle")}
              </h3>
              <div className="space-y-4 text-muted-foreground font-sans text-base leading-relaxed">
                <p>{t("philosophy.blockchainP1")}</p>
                <p>{t("philosophy.blockchainP2")}</p>
              </div>
            </motion.div>
          </div>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className="divider-gold my-24"
          />

          {/* Mission statement */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h3 className="font-display text-2xl md:text-3xl text-foreground mb-8 tracking-wide">
              {t("philosophy.missionTitle")} <span className="text-gradient-gold">{t("philosophy.missionHighlight")}</span>
            </h3>
            <p className="text-foreground font-sans text-xl leading-relaxed mb-6">
              {t("philosophy.missionP1")}
            </p>
            <p className="text-muted-foreground font-sans text-lg leading-relaxed mb-6">
              {t("philosophy.missionP2")}
            </p>
            <p className="text-foreground font-sans text-lg leading-relaxed mb-8">
              {t("philosophy.missionP3")}
            </p>
            <Button
              asChild
              size="lg"
              className="bg-pahlavi-gold hover:bg-pahlavi-gold/90 text-background font-display tracking-wider mt-2"
            >
              <a href="https://cyrus.cash/mint">
                <Coins className="mr-2 h-5 w-5" />
                {t("common.joinMovement")}
              </a>
            </Button>
            <div className="pt-8 mt-8 border-t border-pahlavi-gold/20">
              <p className="text-muted-foreground font-sans text-base">
                {t("philosophy.foundedBy")}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Philosophy;
