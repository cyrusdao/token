import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ExternalLink, FileText, Vote, MessageSquare, BarChart3, MapPin, Gift, Wallet } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Dao = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "fa";

  const actions = [
    { icon: FileText, text: t("dao.action1") },
    { icon: MessageSquare, text: t("dao.action2") },
    { icon: Vote, text: t("dao.action3") },
    { icon: BarChart3, text: t("dao.action4") },
  ];

  const features = [
    { icon: MapPin, title: t("dao.chapters"), desc: t("dao.chaptersDesc") },
    { icon: Gift, title: t("dao.grants"), desc: t("dao.grantsDesc") },
    { icon: Wallet, title: t("dao.treasury"), desc: t("dao.treasuryDesc") },
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
              {t("dao.badge")}
            </span>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-foreground mt-4 mb-6 tracking-wide">
              {t("dao.title")}
              <br />
              <span className="text-gradient-gold">{t("dao.titleHighlight")}</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("dao.description")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-lg text-muted-foreground mb-12">
                {t("dao.intro")}
              </p>

              <h2 className="font-display text-2xl text-foreground mb-6">
                {t("dao.whatHoldersDo")}
              </h2>
              <div className="grid sm:grid-cols-2 gap-4 mb-12">
                {actions.map((action, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 glass glass-border rounded-xl"
                  >
                    <div className="w-10 h-10 rounded-full bg-pahlavi-gold/10 flex items-center justify-center flex-shrink-0">
                      <action.icon className="w-5 h-5 text-pahlavi-gold" />
                    </div>
                    <span className="text-foreground">{action.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="glass glass-border rounded-2xl p-8"
                >
                  <div className="w-12 h-12 rounded-full bg-pahlavi-gold/10 flex items-center justify-center mb-6">
                    <feature.icon className="w-6 h-6 text-pahlavi-gold" />
                  </div>
                  <h3 className="font-display text-xl text-foreground mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>
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
            className="max-w-2xl mx-auto"
          >
            <h2 className="font-display text-3xl text-foreground mb-6">
              {t("common.enterGovernance")}
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="gold" size="lg" asChild>
                <a href="https://cyrus.vote" target="_blank" rel="noopener noreferrer">
                  {t("dao.joinDao")}
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
              <Button variant="gold-outline" size="lg" asChild>
                <a href="/pars">
                  Learn about PARS
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Dao;
