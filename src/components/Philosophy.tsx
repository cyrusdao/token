import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Coins } from "lucide-react";

const Philosophy = () => {
  return (
    <section id="philosophy" className="py-32 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-section" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <span className="font-mono text-[11px] tracking-[0.15em] uppercase text-muted-foreground">
              Our Philosophy
            </span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mt-4 tracking-wide text-balance">
              The First Charter of
              <br />
              <span className="text-gradient-gold">Human Rights</span>
            </h2>
          </motion.div>

          {/* Quote block */}
          <motion.blockquote
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative mb-24"
          >
            <div className="text-center">
              <span className="text-6xl text-pahlavi-gold/20 font-display">"</span>
              <p className="font-display text-2xl md:text-3xl lg:text-4xl text-foreground leading-relaxed max-w-4xl mx-auto -mt-8 italic tracking-wide">
                I gathered all their peoples and returned them to their homes. 
                I restored their sanctuaries and let them worship their gods.
              </p>
              <div className="mt-8">
                <cite className="not-italic">
                  <span className="text-pahlavi-gold font-display text-lg tracking-wide">
                    Cyrus the Great
                  </span>
                  <span className="block font-mono text-[10px] tracking-[0.15em] uppercase text-muted-foreground mt-2">
                    The Cyrus Cylinder — 539 BCE
                  </span>
                </cite>
              </div>
            </div>
          </motion.blockquote>

          {/* Philosophy content */}
          <div className="grid md:grid-cols-2 gap-16 md:gap-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h3 className="font-display text-2xl text-foreground mb-6 tracking-wide">
                A Legacy That Endures
              </h3>
              <div className="space-y-4 text-muted-foreground font-sans text-base leading-relaxed">
                <p>
                  In 539 BCE, when Cyrus conquered Babylon, he did something unprecedented. 
                  Rather than enslave or oppress, he freed captive peoples—including the 
                  Jews, whom he allowed to return to Jerusalem and rebuild their temple.
                </p>
                <p>
                  The Cyrus Cylinder, now housed in the British Museum, is recognized by 
                  the United Nations as the world's first charter of human rights. It 
                  proclaimed religious freedom, abolished slavery, and established the 
                  dignity of all peoples.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h3 className="font-display text-2xl text-foreground mb-6 tracking-wide">
                Why We Choose Blockchain
              </h3>
              <div className="space-y-4 text-muted-foreground font-sans text-base leading-relaxed">
                <p>
                  Just as Cyrus decentralized power across his empire's 23 satrapies, 
                  blockchain technology enables transparent, community-driven governance 
                  that no single authority can control.
                </p>
                <p>
                  The Cyrus DAO, holding 50% of all tokens, is governed entirely by 
                  token holders. Every vote is recorded immutably. Every allocation is 
                  transparent. This is Cyrus's vision of distributed power, encoded 
                  for the digital age.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className="divider-gold my-24"
          />

          {/* Mission statement */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h3 className="font-display text-2xl md:text-3xl text-foreground mb-8 tracking-wide">
              Our <span className="text-gradient-gold">Mission</span>
            </h3>
            <p className="text-foreground font-sans text-xl leading-relaxed mb-6">
              The Cyrus Coin was created as a symbol of <span className="text-pahlavi-gold">urgency, unity, and national revival</span>.
            </p>
            <p className="text-muted-foreground font-sans text-lg leading-relaxed mb-6">
              Rooted in the legacy of Cyrus the Great, its mission is to support the Iranian people 
              in their struggle for freedom after decades of oppression. It seeks to empower the revolution, 
              aid a transition toward Reza Pahlavi and a stable interim government, and lay the foundations 
              for a democratic, prosperous Iran.
            </p>
            <p className="text-foreground font-sans text-lg leading-relaxed mb-8">
              Beyond the fight, it embodies a long-term commitment to rebuilding a <span className="text-pahlavi-gold">strong and proud nation</span>.
            </p>
            <Button 
              asChild
              size="lg" 
              className="bg-pahlavi-gold hover:bg-pahlavi-gold/90 text-background font-display tracking-wider mt-2"
            >
              <a href="https://cyrus.cash/mint">
                <Coins className="mr-2 h-5 w-5" />
                Join the Movement
              </a>
            </Button>
            <div className="pt-8 mt-8 border-t border-pahlavi-gold/20">
              <p className="text-muted-foreground font-sans text-base">
                Founded by <span className="text-pahlavi-gold">Cyrus Pahlavi</span> and the Cyrus Foundation (cyrus.ngo)
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Philosophy;
