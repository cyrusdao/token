import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const stats = [
  { value: "100%", label: "On-Chain" },
  { value: "1 Token", label: "1 Vote" },
  { value: "Open", label: "Proposals" },
  { value: "Immutable", label: "Records" },
];

const Governance = () => {
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
              Decentralized Governance
            </span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mt-4 mb-8 tracking-wide leading-[1.1]">
              Your Voice.
              <br />
              <span className="text-gradient-gold">Your Vote.</span>
            </h2>

            <div className="space-y-6 mb-10">
              <p className="text-muted-foreground font-sans text-lg leading-relaxed">
                True to Cyrus's vision of distributed power, every CYRUS token holder 
                governs this organization collectively. No central authority decides 
                how funds are used—the community does.
              </p>
              <p className="text-muted-foreground font-sans text-base leading-relaxed">
                Vote on which villages receive wells. Decide which heritage sites to 
                restore. Choose which scholarship recipients to support. Every proposal 
                is debated openly, every vote recorded immutably on-chain.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="gold" size="lg" asChild>
                <a href="https://cyrus.vote" target="_blank" rel="noopener noreferrer">
                  Cast Your Vote
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
              <Button variant="gold-outline" size="lg">
                View Proposals
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
                Governance active at{" "}
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
