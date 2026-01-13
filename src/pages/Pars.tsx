import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ExternalLink, Lock, Coins, Users, Zap } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Pars = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "fa";

  const uses = [
    { icon: Users, text: t("pars.use1") },
    { icon: Lock, text: t("pars.use2") },
    { icon: Coins, text: t("pars.use3") },
    { icon: Zap, text: t("pars.use4") },
  ];

  return (
    <div className={`min-h-screen bg-background ${isRTL ? "rtl" : "ltr"}`}>
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <span className="font-mono text-[11px] tracking-[0.15em] uppercase text-muted-foreground">
              {t("pars.badge")}
            </span>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-foreground mt-4 mb-6 tracking-wide">
              {t("pars.title")}
              <br />
              <span className="text-gradient-gold">{t("pars.titleHighlight")}</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("pars.description")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* What is PARS */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-display text-3xl md:text-4xl text-foreground mb-6">
                {t("pars.whatIs")}
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                {t("pars.whatIsDesc")}
              </p>

              <h3 className="font-display text-2xl text-foreground mb-4">
                {t("pars.uses")}
              </h3>
              <ul className="space-y-4 mb-12">
                {uses.map((use, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-10 h-10 rounded-full bg-pahlavi-gold/10 flex items-center justify-center">
                      <use.icon className="w-5 h-5 text-pahlavi-gold" />
                    </div>
                    <span className="text-foreground">{use.text}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-display text-3xl md:text-4xl text-foreground mb-6">
                {t("pars.howItWorks")}
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                {t("pars.howItWorksDesc")}
              </p>

              {/* Paired Lock */}
              <div className="glass glass-border rounded-2xl p-8 mb-8">
                <h3 className="font-display text-xl text-pahlavi-gold mb-4">
                  {t("pars.pairedLock")}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {t("pars.pairedLockDesc")}
                </p>
                <code className="block bg-background/50 p-4 rounded-lg font-mono text-sm text-foreground">
                  {t("pars.formula")}
                </code>
              </div>

              {/* Earn PARS */}
              <h3 className="font-display text-2xl text-foreground mb-4">
                {t("pars.earnPars")}
              </h3>
              <p className="text-muted-foreground mb-4">
                {t("pars.earnParsDesc")}
              </p>
              <p className="text-sm text-muted-foreground/70 italic">
                {t("pars.demurrage")}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6 text-center">
          <Button variant="gold" size="lg" asChild>
            <a href="https://cyrus.vote" target="_blank" rel="noopener noreferrer">
              {t("common.enterGovernance")}
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pars;
