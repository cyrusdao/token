import { useTranslation } from "react-i18next";
import { useEffect } from "react";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const setLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
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

  const isEnglish = i18n.language === "en";
  const isFarsi = i18n.language === "fa";

  return (
    <div className="flex items-center glass glass-border rounded-full p-0.5">
      <button
        onClick={() => setLanguage("en")}
        className={`
          px-3 py-1 text-xs font-mono tracking-wider rounded-full transition-all duration-200
          ${isEnglish
            ? "bg-pahlavi-gold text-background"
            : "text-muted-foreground hover:text-foreground"
          }
        `}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage("fa")}
        className={`
          px-3 py-1 text-xs font-mono tracking-wider rounded-full transition-all duration-200
          ${isFarsi
            ? "bg-pahlavi-gold text-background"
            : "text-muted-foreground hover:text-foreground"
          }
        `}
      >
        FA
      </button>
    </div>
  );
};

export default LanguageSwitcher;
