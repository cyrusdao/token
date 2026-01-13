import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ExternalLink, Lock, Vote, Users, TrendingUp, Coins } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const CyrusToken = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "fa";

  const utilities = [
    { icon: Lock, text: t("cyrusToken.utility1") },
    { icon: Vote, text: t("cyrusToken.utility2") },
    { icon: Users, text: t("cyrusToken.utility3") },
    { icon: TrendingUp, text: t("cyrusToken.utility4") },
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
              {t("cyrusToken.badge")}
            </span>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-foreground mt-4 mb-6 tracking-wide">
              {t("cyrusToken.title")}
              <br />
              <span className="text-gradient-gold">{t("cyrusToken.titleHighlight")}</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("cyrusToken.description")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* What is CYRUS */}
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
                {t("cyrusToken.whatIs")}
              </h2>
              <p className="text-lg text-muted-foreground mb-12">
                {t("cyrusToken.whatIsDesc")}
              </p>

              <h3 className="font-display text-2xl text-foreground mb-6">
                {t("cyrusToken.utility")}
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {utilities.map((utility, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 glass glass-border rounded-xl"
                  >
                    <div className="w-10 h-10 rounded-full bg-pahlavi-gold/10 flex items-center justify-center flex-shrink-0">
                      <utility.icon className="w-5 h-5 text-pahlavi-gold" />
                    </div>
                    <span className="text-foreground">{utility.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How to Get */}
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
                {t("cyrusToken.howToGet")}
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                {t("cyrusToken.howToGetDesc")}
              </p>

              {/* Supply Info */}
              <div className="glass glass-border rounded-2xl p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-pahlavi-gold/10 flex items-center justify-center">
                    <Coins className="w-6 h-6 text-pahlavi-gold" />
                  </div>
                  <h3 className="font-display text-xl text-foreground">
                    {t("cyrusToken.supply")}
                  </h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  {t("cyrusToken.supplyDesc")}
                </p>
                <p className="text-sm text-pahlavi-gold font-mono">
                  {t("cyrusToken.distribution")}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button variant="gold" size="lg" asChild>
              <a href="/#buy">
                {t("common.buyCyrus")}
              </a>
            </Button>
            <Button variant="gold-outline" size="lg" asChild>
              <a href="https://app.uniswap.org" target="_blank" rel="noopener noreferrer">
                {t("common.trade")}
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CyrusToken;
