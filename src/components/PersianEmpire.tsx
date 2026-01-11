import { motion } from "framer-motion";
import achaemenidMap from "@/assets/achaemenid-map.jpeg";

const historicalFacts = [
  {
    stat: "550–330 BCE",
    label: "Achaemenid Empire",
    description: "The first Persian Empire, founded by Cyrus the Great, lasted over 200 years and became the largest empire the ancient world had ever seen.",
  },
  {
    stat: "5.5M km²",
    label: "Empire Territory",
    description: "At its peak under Darius I, the Achaemenid Empire spanned from Egypt and Libya in the west to the Indus River in the east—44% of the world's population.",
  },
  {
    stat: "539 BCE",
    label: "Babylon Conquered",
    description: "Cyrus peacefully entered Babylon and freed the Jewish people from captivity, allowing them to return home and rebuild their temple in Jerusalem.",
  },
  {
    stat: "23",
    label: "Satrapies (Provinces)",
    description: "The empire was divided into provinces, each with local autonomy—a revolutionary form of governance that respected diverse cultures and religions.",
  },
];

const PersianEmpire = () => {
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
            Historical Legacy
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mt-4 tracking-wide text-balance">
            The First
            <span className="text-gradient-gold"> World Empire</span>
          </h2>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-center max-w-3xl mx-auto text-muted-foreground font-sans text-lg mb-16"
        >
          The Achaemenid Empire established by Cyrus the Great was not just the largest 
          empire of the ancient world—it was the first to embrace religious tolerance, 
          cultural diversity, and human rights as governing principles.
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
              alt="Ancient Persia - Achaemenid Empire map showing territories from the Black Sea to the Persian Gulf" 
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
              key={fact.label}
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
