import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import achaemenidMap from "@/assets/achaemenid-map.jpeg";

const PersianEmpire = () => {
  const { t } = useTranslation();

  const historicalFacts = [
    {
      stat: t("empire.stat1"),
      label: t("empire.stat1Label"),
      description: t("empire.stat1Desc"),
    },
    {
      stat: t("empire.stat2"),
      label: t("empire.stat2Label"),
      description: t("empire.stat2Desc"),
    },
    {
      stat: t("empire.stat3"),
      label: t("empire.stat3Label"),
      description: t("empire.stat3Desc"),
    },
    {
      stat: t("empire.stat4"),
      label: t("empire.stat4Label"),
      description: t("empire.stat4Desc"),
    },
  ];

  return (
    <section id="empire" className="py-32 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-section" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-6"
        >
          <span className="font-mono text-[11px] tracking-[0.15em] uppercase text-muted-foreground">
            {t("empire.badge")}
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mt-4 tracking-wide text-balance">
            {t("empire.title")}
            <span className="text-gradient-gold"> {t("empire.titleHighlight")}</span>
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-center max-w-3xl mx-auto text-muted-foreground font-sans text-lg mb-16"
        >
          {t("empire.description")}
        </motion.p>

        {/* Historical Map */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-20"
        >
          <div className="relative max-w-5xl mx-auto">
            <img
              src={achaemenidMap}
              alt={t("empire.mapAlt")}
              className="w-full h-auto rounded-lg shadow-2xl"
            />
            {/* Subtle golden overlay for brand consistency */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent rounded-lg pointer-events-none" />
          </div>
        </motion.div>

        {/* Stats grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {historicalFacts.map((fact, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="glass glass-border rounded-xl p-8 text-center"
            >
              <div className="font-display text-3xl md:text-4xl text-pahlavi-gold mb-2 tracking-wide">
                {fact.stat}
              </div>
              <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-4">
                {fact.label}
              </div>
              <p className="text-muted-foreground font-sans text-sm leading-relaxed">
                {fact.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PersianEmpire;
