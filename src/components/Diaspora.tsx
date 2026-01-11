import { motion } from "framer-motion";
import { Globe, Users, Building, Heart } from "lucide-react";

const diasporaData = [
  {
    region: "United States",
    population: "~1.5 million",
    note: "Largest diaspora community, concentrated in Los Angeles ('Tehrangeles'), New York, and Washington D.C.",
  },
  {
    region: "Europe",
    population: "~500,000+",
    note: "Significant communities in Germany, United Kingdom, France, Sweden, and the Netherlands.",
  },
  {
    region: "Canada",
    population: "~400,000",
    note: "Major communities in Toronto and Vancouver, with strong cultural institutions.",
  },
  {
    region: "Middle East",
    population: "~300,000+",
    note: "Communities in UAE, Turkey, and other regional countries.",
  },
  {
    region: "Australia",
    population: "~100,000",
    note: "Growing community primarily in Sydney and Melbourne.",
  },
];

const Diaspora = () => {
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
            Global Community
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mt-4 tracking-wide text-balance">
            The Persian
            <span className="text-gradient-gold"> Diaspora</span>
          </h2>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-center max-w-3xl mx-auto text-muted-foreground font-sans text-lg mb-20"
        >
          An estimated 4-5 million Iranians live outside of Iran, forming one of the 
          world's most accomplished diaspora communities. From Silicon Valley to 
          Hollywood, from academia to medicine, Iranians contribute to societies worldwide.
        </motion.p>

        {/* Icon stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {[
            { icon: Globe, value: "80+", label: "Countries" },
            { icon: Users, value: "4-5M", label: "Diaspora Population" },
            { icon: Building, value: "3,000+", label: "Years of Civilization" },
            { icon: Heart, value: "1", label: "Shared Heritage" },
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
              key={item.region}
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
            CYRUS unites this global community through shared values and collective action.
          </p>
          <p className="text-muted-foreground font-sans text-base leading-relaxed">
            Whether you're in Los Angeles, London, or Tehran—the Cyrus DAO empowers 
            every token holder to vote on initiatives that preserve Persian heritage, 
            support humanitarian causes, and spread Cyrus's message of tolerance.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Diaspora;
