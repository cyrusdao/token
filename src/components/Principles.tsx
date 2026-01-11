import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const Principles = () => {
  const { t } = useTranslation();

  const principles = [
    {
      number: t('principles.p1Number'),
      title: t('principles.p1Title'),
      description: t('principles.p1Desc'),
    },
    {
      number: t('principles.p2Number'),
      title: t('principles.p2Title'),
      description: t('principles.p2Desc'),
    },
    {
      number: t('principles.p3Number'),
      title: t('principles.p3Title'),
      description: t('principles.p3Desc'),
    },
    {
      number: t('principles.p4Number'),
      title: t('principles.p4Title'),
      description: t('principles.p4Desc'),
    },
  ];

  return (
    <section id="principles" className="py-32 bg-secondary/50 relative overflow-hidden">
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
            {t('principles.badge')}
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mt-4 tracking-wide">
            {t('principles.title')}
            <span className="text-gradient-gold"> {t('principles.titleHighlight')}</span>
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-center max-w-2xl mx-auto text-muted-foreground font-sans text-lg mb-20"
        >
          {t('principles.description')}
        </motion.p>

        {/* Principles list - Apple inspired minimal design */}
        <div className="max-w-4xl mx-auto">
          {principles.map((principle, index) => (
            <motion.div
              key={principle.number}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group"
            >
              <div className="border-t border-border/50 py-12 md:py-16 grid md:grid-cols-12 gap-6 md:gap-12 items-start">
                {/* Number */}
                <div className="md:col-span-2">
                  <span className="font-mono text-pahlavi-gold/40 text-sm tracking-wider">
                    {principle.number}
                  </span>
                </div>

                {/* Title */}
                <div className="md:col-span-4">
                  <h3 className="font-display text-2xl md:text-3xl text-foreground tracking-wide group-hover:text-pahlavi-gold transition-colors duration-500">
                    {principle.title}
                  </h3>
                </div>

                {/* Description */}
                <div className="md:col-span-6">
                  <p className="text-muted-foreground font-sans text-base leading-relaxed">
                    {principle.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Bottom border */}
          <div className="border-t border-border/50" />
        </div>
      </div>
    </section>
  );
};

export default Principles;
