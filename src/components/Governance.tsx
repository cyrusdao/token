import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const Governance = () => {
  const { t } = useTranslation();

  const stats = [
    { value: t('governance.stat1Value'), label: t('governance.stat1Label') },
    { value: t('governance.stat2Value'), label: t('governance.stat2Label') },
    { value: t('governance.stat3Value'), label: t('governance.stat3Label') },
    { value: t('governance.stat4Value'), label: t('governance.stat4Label') },
  ];

  return (
    <section id="governance" className="py-32 bg-secondary/50 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-section" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="font-mono text-[11px] tracking-[0.15em] uppercase text-muted-foreground">
              {t('governance.badge')}
            </span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mt-4 mb-8 tracking-wide leading-[1.1]">
              {t('governance.yourVoice')}
              <br />
              <span className="text-gradient-gold">{t('governance.yourVote')}</span>
            </h2>

            <div className="space-y-6 mb-10">
              <p className="text-muted-foreground font-sans text-lg leading-relaxed">
                {t('governance.p1')}
              </p>
              <p className="text-muted-foreground font-sans text-base leading-relaxed">
                {t('governance.p2')}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="gold" size="lg" asChild>
                <a href="https://cyrus.vote" target="_blank" rel="noopener noreferrer">
                  {t('governance.castVote')}
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
              <Button variant="gold-outline" size="lg">
                {t('governance.viewProposals')}
              </Button>
            </div>
          </motion.div>

          {/* Right stats - Apple inspired grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="grid grid-cols-2 gap-px bg-border/30 rounded-2xl overflow-hidden">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  className="bg-background p-8 md:p-12 text-center"
                >
                  <div className="font-display text-3xl md:text-4xl text-pahlavi-gold mb-3 tracking-wide">
                    {stat.value}
                  </div>
                  <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-muted-foreground">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Active indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-6 flex items-center justify-center gap-3 p-6 glass glass-border rounded-xl"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pahlavi-emerald opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-pahlavi-emerald" />
              </span>
              <span className="font-sans text-sm text-muted-foreground">
                {t('governance.activeAt')}{" "}
                <a
                  href="https://cyrus.vote"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pahlavi-gold hover:text-pahlavi-gold-light transition-colors"
                >
                  cyrus.vote
                </a>
              </span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Governance;
