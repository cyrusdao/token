import { Separator } from "@/components/ui/separator";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const links = {
    project: [
      { name: "Philosophy", href: "#philosophy" },
      { name: "Persian Empire", href: "#empire" },
      { name: "Diaspora", href: "#diaspora" },
      { name: "Tokenomics", href: "#tokenomics" },
      { name: "FAQ", href: "#faq" },
    ],
    resources: [
      { name: "Whitepaper", href: "/whitepaper.pdf" },
      { name: "Audit Report", href: "#" },
      { name: "Contract Address", href: "#" },
      { name: "Brand Assets", href: "#" },
    ],
    ecosystem: [
      { name: "cyrus.ngo", href: "https://cyrus.ngo", external: true },
      { name: "cyrus.vote", href: "https://cyrus.vote", external: true },
      { name: "Base Blockchain", href: "https://base.org", external: true },
    ],
    social: [
      { name: "Twitter / X", href: "#", external: true },
      { name: "Discord", href: "#", external: true },
      { name: "Telegram", href: "#", external: true },
    ],
  };

  return (
    <footer className="bg-background border-t border-border/50">
      <div className="container mx-auto px-6 py-20">
        {/* Main footer content */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <span className="font-display text-lg tracking-[0.2em] text-foreground">
                CYRUS
              </span>
              <span className="text-gradient-gold font-display text-lg tracking-[0.2em]">
                .CASH
              </span>
            </div>
            <p className="text-muted-foreground font-sans text-sm leading-relaxed max-w-xs mb-4">
              A community token honoring Cyrus the Great's legacy. Founded by the 
              Cyrus Foundation (cyrus.ngo). Available exclusively on Base blockchain.
            </p>
            <p className="font-mono text-[10px] tracking-[0.1em] uppercase text-muted-foreground/60">
              50% DAO Treasury • 10% LP • 40% Public Sale • Base Network
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-mono text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-6">
              Project
            </h4>
            <ul className="space-y-3">
              {links.project.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors font-sans text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-6">
              Resources
            </h4>
            <ul className="space-y-3">
              {links.resources.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors font-sans text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-6">
              Ecosystem
            </h4>
            <ul className="space-y-3">
              {links.ecosystem.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="text-muted-foreground hover:text-foreground transition-colors font-sans text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-6">
              Social
            </h4>
            <ul className="space-y-3">
              {links.social.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="text-muted-foreground hover:text-foreground transition-colors font-sans text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="bg-border/50" />

        {/* Disclaimer */}
        <div className="py-8">
          <p className="text-muted-foreground/60 font-sans text-xs leading-relaxed max-w-4xl">
            <strong className="text-muted-foreground">Disclaimer:</strong> CYRUS is a community meme token 
            and is not a security, investment contract, or financial instrument. There is no promise, 
            expectation, or guarantee of appreciation in value. CYRUS tokens are intended solely for 
            community participation and governance within the Cyrus DAO ecosystem. Purchase and hold 
            tokens at your own risk. Always do your own research. Not available to residents of 
            jurisdictions where prohibited.
          </p>
        </div>

        <Separator className="bg-border/50" />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8">
          <div className="flex items-center gap-6 text-muted-foreground/60 font-sans text-xs">
            <span>© {currentYear} Cyrus Foundation</span>
            <a href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-foreground transition-colors">Terms of Service</a>
          </div>
          <p className="font-sans text-muted-foreground/60 text-xs">
            پارسی را نیک دار — Keep Persia Great
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
