import { motion } from "framer-motion";
import { Globe, Users, Building, Heart } from "lucide-react";
import { useTranslation } from "react-i18next";

const Diaspora = () => {
  const { t } = useTranslation();

  const diasporaData = [
    {
      region: t("diaspora.region1"),
      population: t("diaspora.region1Pop"),
      note: t("diaspora.region1Note"),
    },
    {
      region: t("diaspora.region2"),
      population: t("diaspora.region2Pop"),
      note: t("diaspora.region2Note"),
    },
    {
      region: t("diaspora.region3"),
      population: t("diaspora.region3Pop"),
      note: t("diaspora.region3Note"),
    },
    {
      region: t("diaspora.region4"),
      population: t("diaspora.region4Pop"),
      note: t("diaspora.region4Note"),
    },
    {
      region: t("diaspora.region5"),
      population: t("diaspora.region5Pop"),
      note: t("diaspora.region5Note"),
    },
  ];

  return (
    <section id="diaspora" className="py-32 bg-secondary/50 relative overflow-hidden">
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
            {t("diaspora.badge")}
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mt-4 tracking-wide text-balance">
            {t("diaspora.title")}
            <span className="text-gradient-gold"> {t("diaspora.titleHighlight")}</span>
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-center max-w-3xl mx-auto text-muted-foreground font-sans text-lg mb-20"
        >
          {t("diaspora.description")}
        </motion.p>

        {/* Icon stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {[
            { icon: Globe, value: "80+", label: t("diaspora.countries") },
            { icon: Users, value: "4-5M", label: t("diaspora.population") },
            { icon: Building, value: "3,000+", label: t("diaspora.civilization") },
            { icon: Heart, value: "1", label: t("diaspora.heritage") },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-secondary/80 flex items-center justify-center mx-auto mb-4">
                <item.icon className="w-5 h-5 text-pahlavi-gold" />
              </div>
              <div className="font-display text-2xl md:text-3xl text-foreground tracking-wide">
                {item.value}
              </div>
              <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-muted-foreground mt-1">
                {item.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Diaspora regions */}
        <div className="max-w-4xl mx-auto space-y-0">
          {diasporaData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              className="border-t border-border/50 py-8 grid md:grid-cols-12 gap-4 items-start"
            >
              <div className="md:col-span-3">
                <h3 className="font-display text-xl text-foreground tracking-wide">
                  {item.region}
                </h3>
              </div>
              <div className="md:col-span-2">
                <span className="font-mono text-sm text-pahlavi-gold">
                  {item.population}
                </span>
              </div>
              <div className="md:col-span-7">
                <p className="text-muted-foreground font-sans text-sm leading-relaxed">
                  {item.note}
                </p>
              </div>
            </motion.div>
          ))}
          <div className="border-t border-border/50" />
        </div>

        {/* Mission statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 text-center max-w-3xl mx-auto"
        >
          <p className="text-foreground font-sans text-xl leading-relaxed mb-4">
            {t("diaspora.unityMessage")}
          </p>
          <p className="text-muted-foreground font-sans text-base leading-relaxed">
            {t("diaspora.unityDescription")}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Diaspora;
