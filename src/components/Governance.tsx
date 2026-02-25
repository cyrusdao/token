import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

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
              Governance
            </span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mt-4 mb-8 tracking-wide leading-[1.1]">
              Your Ticket to the
              <br />
              <span className="text-gradient-gold">Pars Network</span>
            </h2>

            <div className="space-y-6 mb-10">
              <p className="text-muted-foreground font-sans text-lg leading-relaxed">
                Where <em className="text-foreground not-italic italic">your</em> vote matters.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="gold" size="lg" disabled>
                Coming Soon
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
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-40 h-40 rounded-full bg-yellow-400/20 border-4 border-yellow-400 flex items-center justify-center mb-8">
                <span className="text-yellow-400 text-5xl">🏗</span>
              </div>
              <p className="font-display text-2xl md:text-3xl text-yellow-400 tracking-wide text-center">
                Governance under construction
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Governance;
