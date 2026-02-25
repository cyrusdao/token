import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import cyrusCoinFace from "@/assets/cyrus-coin-face.png";
import freedomLion from "@/assets/freedom-lion.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: t("nav.philosophy"), href: "#philosophy" },
    { name: t("nav.empire"), href: "#empire" },
    { name: t("nav.diaspora"), href: "#diaspora" },
    { name: t("nav.tokenomics"), href: "#tokenomics" },
    { name: t("nav.faq"), href: "#faq" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass glass-border bg-background/90 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo with coin image - clean 3D coin */}
          <a href="#" className="group flex items-center gap-3">
            {/* 3D Coin with proper thickness */}
            <div className="relative w-10 h-10" style={{ perspective: '200px' }}>
              <motion.div
                className="w-full h-full relative"
                style={{ transformStyle: 'preserve-3d' }}
                animate={{ rotateY: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              >
                {/* Front face - Cyrus portrait */}
                <img
                  src={cyrusCoinFace}
                  alt="Cyrus Coin"
                  className="absolute inset-0 w-full h-full rounded-full object-cover"
                  style={{ backfaceVisibility: 'hidden', transform: 'translateZ(2px)' }}
                />
                {/* Back face - Freedom Lion */}
                <img
                  src={freedomLion}
                  alt="Cyrus Coin Back"
                  className="absolute inset-0 w-full h-full rounded-full object-cover"
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg) translateZ(2px)' }}
                />
                {/* Gold edge */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    transform: 'translateZ(0px)',
                    background: 'linear-gradient(90deg, #B8860B 0%, #D4AF37 50%, #B8860B 100%)',
                    boxShadow: 'inset 0 0 3px rgba(0,0,0,0.3)',
                  }}
                />
              </motion.div>
            </div>
            {/* CYRUS text logo */}
            <span className="font-display text-xl font-bold tracking-[0.15em] text-foreground">
              CYRUS
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="font-sans text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
            <a
              href="https://pars.vote"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 border-2 border-pahlavi-gold text-pahlavi-gold font-semibold rounded-lg hover:bg-pahlavi-gold hover:text-background transition-all text-sm"
            >
              Join DAO
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-foreground p-2 -mr-2"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden glass-border border-t bg-background/95 backdrop-blur-xl"
            >
              <div className="py-8 space-y-1">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block py-3 font-sans text-muted-foreground hover:text-foreground transition-colors duration-300 text-base"
                  >
                    {link.name}
                  </a>
                ))}
                <div className="pt-6 flex flex-col gap-3">
                  <div className="flex justify-center pb-2">
                    <LanguageSwitcher />
                  </div>
                  <a
                    href="https://pars.vote"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 border-2 border-pahlavi-gold text-pahlavi-gold font-semibold rounded-lg hover:bg-pahlavi-gold hover:text-background transition-all text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    Join DAO
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
