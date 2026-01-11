import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "fa" ? "en" : "fa";
    i18n.changeLanguage(newLang);
  };

  // Update document direction and lang attribute when language changes
  useEffect(() => {
    const dir = i18n.language === "fa" ? "rtl" : "ltr";
    document.documentElement.dir = dir;
    document.documentElement.lang = i18n.language;

    // Add/remove RTL class for styling
    if (i18n.language === "fa") {
      document.body.classList.add("rtl");
    } else {
      document.body.classList.remove("rtl");
    }
  }, [i18n.language]);

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="font-mono text-xs tracking-wider px-3 py-1 h-8 glass glass-border hover:border-pahlavi-gold/30"
    >
      {i18n.language === "fa" ? "EN" : "FA"}
    </Button>
  );
};

export default LanguageSwitcher;
