import { motion } from "framer-motion";

const principles = [
  {
    number: "01",
    title: "Religious Tolerance",
    description:
      "Cyrus freed the Jewish people from Babylonian captivity and funded the rebuilding of their temple. He permitted all peoples to worship freely. We champion this principle—every faith deserves respect and protection.",
  },
  {
    number: "02",
    title: "Human Dignity",
    description:
      "The Cyrus Cylinder explicitly abolished slavery, recognizing every person's inherent worth. Today, we extend this principle through humanitarian aid—food, water, shelter, and education for all who need it.",
  },
  {
    number: "03",
    title: "Justice & Equality",
    description:
      "Cyrus established laws that applied equally to nobles and servants alike. Our governance follows this model—every CYRUS token holder has an equal voice, and every decision is transparently recorded.",
  },
  {
    number: "04",
    title: "Cultural Preservation",
    description:
      "Rather than erasing conquered cultures, Cyrus celebrated diversity as strength. We preserve Persian heritage—art, philosophy, language—while supporting the traditions of all peoples we serve.",
  },
];

const Principles = () => {
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
            Core Principles
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mt-4 tracking-wide">
            Values That
            <span className="text-gradient-gold"> Endure</span>
          </h2>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-center max-w-2xl mx-auto text-muted-foreground font-sans text-lg mb-20"
        >
          Derived directly from the Cyrus Cylinder, these principles guide every 
          decision we make as an organization.
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
