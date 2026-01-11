import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronDown, Coins, FileText } from "lucide-react";
import CyrusCoin3D from "./CyrusCoin3D";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-visible bg-background">
      {/* Ambient gradient glow */}
      <div className="absolute inset-0 bg-gradient-hero" />
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 geometric-pattern opacity-50" />

      {/* 3D Coin - Full viewport, pinned to right side */}
      <div className="absolute inset-0 pointer-events-auto z-0 overflow-visible">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="absolute inset-0 flex items-center justify-end overflow-visible"
        >
          <div className="w-full h-full translate-x-[25%]">
            <CyrusCoin3D />
          </div>
        </motion.div>
      </div>

      {/* Content - above coin */}
      <div className="relative z-10 container mx-auto px-6 pt-24 pb-16 pointer-events-none">
        <div className="max-w-2xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.15em] uppercase text-muted-foreground glass glass-border px-4 py-2 rounded-full pointer-events-auto">
              <span className="w-1.5 h-1.5 rounded-full bg-pahlavi-emerald animate-pulse" />
              Founded by Cyrus Foundation
            </span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="font-display text-5xl md:text-6xl lg:text-7xl text-foreground mb-6 leading-[1.05] tracking-wide text-balance drop-shadow-lg"
          >
            The Spirit of
            <br />
            <span className="text-gradient-gold">Cyrus Lives On</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="max-w-xl text-muted-foreground text-lg md:text-xl mb-8 font-sans leading-relaxed drop-shadow-md"
          >
            A community-first token unifying the global Persian diaspora around the
            timeless principles of Cyrus the Great—freedom, tolerance, and human dignity.
            50% DAO, 40% public sale. No team allocation. No VC. No pre-sale.
          </motion.p>

          {/* Token info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap gap-6 mb-10"
          >
            {[
              { value: "1B", label: "Supply" },
              { value: "Base", label: "Blockchain" },
              { value: "50%", label: "DAO" },
              { value: "40%", label: "Public" },
            ].map((stat) => (
              <div key={stat.label} className="text-left">
                <div className="font-display text-2xl md:text-3xl text-foreground tracking-wide drop-shadow-md">
                  {stat.value}
                </div>
                <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-muted-foreground mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 pointer-events-auto"
          >
            <Button variant="hero" size="lg" onClick={() => document.getElementById('buy')?.scrollIntoView({ behavior: 'smooth' })}>
              <Coins className="w-5 h-5" />
              Buy CYRUS
            </Button>
            <Button variant="hero-outline" size="lg" className="border-2 border-foreground/40 hover:border-foreground/70" onClick={() => window.open('/whitepaper.pdf', '_blank')}>
              <FileText className="w-5 h-5" />
              Read Whitepaper
            </Button>
          </motion.div>
          
          {/* Disclaimer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-6 text-[11px] text-muted-foreground/60 max-w-md"
          >
            CYRUS is a community meme token. Not a security. No promise of appreciation. 
            Available exclusively on Coinbase Base.
          </motion.p>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
            Scroll
          </span>
          <ChevronDown className="text-muted-foreground w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
