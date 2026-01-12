import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t, i18n } = useTranslation();
  const currentYear = new Date().getFullYear();
  const isRTL = i18n.language === "fa";

  const links = {
    project: [
      { name: t("nav.philosophy"), href: "#philosophy" },
      { name: t("nav.empire"), href: "#empire" },
      { name: t("nav.diaspora"), href: "#diaspora" },
      { name: t("nav.tokenomics"), href: "#tokenomics" },
      { name: t("nav.faq"), href: "#faq" },
    ],
    resources: [
      { name: t("footer.whitepaper"), href: "/whitepaper.pdf" },
      { name: t("footer.whitepaperFa"), href: "/whitepaper-fa.pdf" },
      { name: t("footer.auditReport"), href: "#" },
      { name: t("footer.contractAddress"), href: "#" },
      { name: t("footer.brandAssets"), href: "#" },
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
    <footer className="bg-gradient-to-b from-background to-amber-950/10 border-t border-amber-500/20">
      <div className="container mx-auto px-6 py-20">
        {/* Main footer content */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-background font-display font-bold text-xl">
                C
              </div>
              <div className="flex items-center">
                <span className="font-display text-lg tracking-[0.2em] text-foreground">
                  CYRUS
                </span>
                <span className="text-gradient-gold font-display text-lg tracking-[0.2em]">
                  .CASH
                </span>
              </div>
            </div>
            <p className="text-muted-foreground font-sans text-sm leading-relaxed max-w-xs mb-4">
              {t("footer.brand")}
            </p>
            <p className="font-mono text-[10px] tracking-[0.1em] uppercase text-amber-400/60">
              {t("footer.distribution")}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-mono text-[10px] tracking-[0.15em] uppercase text-amber-400 mb-6">
              {t("footer.project")}
            </h4>
            <ul className="space-y-3">
              {links.project.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-amber-400 transition-colors font-sans text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-[10px] tracking-[0.15em] uppercase text-amber-400 mb-6">
              {t("footer.resources")}
            </h4>
            <ul className="space-y-3">
              {links.resources.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-amber-400 transition-colors font-sans text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-[10px] tracking-[0.15em] uppercase text-amber-400 mb-6">
              {t("footer.ecosystem")}
            </h4>
            <ul className="space-y-3">
              {links.ecosystem.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="text-muted-foreground hover:text-amber-400 transition-colors font-sans text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-[10px] tracking-[0.15em] uppercase text-amber-400 mb-6">
              {t("footer.social")}
            </h4>
            <ul className="space-y-3">
              {links.social.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="text-muted-foreground hover:text-amber-400 transition-colors font-sans text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="bg-amber-500/20" />

        {/* Disclaimer */}
        <div className="py-8">
          <p className="text-muted-foreground/60 font-sans text-xs leading-relaxed max-w-4xl">
            <strong className="text-amber-400/80">Disclaimer:</strong> {t("footer.disclaimer")}
          </p>
        </div>

        <Separator className="bg-amber-500/20" />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8">
          <div className="flex items-center gap-6 text-muted-foreground/60 font-sans text-xs">
            <span>{t("footer.copyright")}</span>
            <a href="/privacy" className="hover:text-amber-400 transition-colors">{t("footer.privacyPolicy")}</a>
            <a href="/terms" className="hover:text-amber-400 transition-colors">{t("footer.termsOfService")}</a>
          </div>
          <p className="font-display text-amber-400/60 text-xs tracking-wider">
            {t("footer.keepPersiaGreat")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
