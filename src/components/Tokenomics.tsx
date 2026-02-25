import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

const Tokenomics = () => {
  const { t } = useTranslation();

  const tokenomicsData = [
    { percentage: "50%", label: t("tokenomics.daoTreasury"), description: t("tokenomics.daoTreasuryDesc") },
    { percentage: "10%", label: t("tokenomics.liquidityPool"), description: t("tokenomics.liquidityPoolDesc") },
    { percentage: "40%", label: t("tokenomics.publicSale"), description: t("tokenomics.publicSaleDesc") },
  ];

  return (
    <section id="tokenomics" className="py-32 bg-background relative overflow-hidden">
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
            {t("tokenomics.badge")}
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mt-4 tracking-wide text-balance">
            {t("tokenomics.title")}
            <span className="text-gradient-gold"> {t("tokenomics.titleHighlight")}</span>
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-center max-w-2xl mx-auto text-muted-foreground font-sans text-lg mb-16"
        >
          {t("tokenomics.description")}
        </motion.p>

        {/* Token specs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <Card className="glass glass-border max-w-3xl mx-auto">
            <CardContent className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                {[
                  { label: t("tokenomics.tokenName"), value: "CYRUS" },
                  { label: t("tokenomics.totalSupply"), value: "1,000,000,000" },
                  { label: t("tokenomics.blockchain"), value: "Base (Coinbase)" },
                  { label: t("tokenomics.tokenType"), value: "ERC-20" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-2">
                      {item.label}
                    </div>
                    <div className="font-sans text-foreground text-sm font-medium">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Distribution */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {tokenomicsData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="glass glass-border h-full">
                <CardContent className="p-8 text-center">
                  <div className="font-display text-5xl md:text-6xl text-pahlavi-gold mb-4 tracking-wide">
                    {item.percentage}
                  </div>
                  <h3 className="font-display text-xl text-foreground mb-3 tracking-wide">
                    {item.label}
                  </h3>
                  <p className="text-muted-foreground font-sans text-sm leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Important notices */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 max-w-3xl mx-auto"
        >
          <Card className="bg-secondary/50 border-border/50">
            <CardContent className="p-6">
              <h4 className="font-mono text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-4">
                {t("tokenomics.importantInfo")}
              </h4>
              <ul className="space-y-2 text-muted-foreground font-sans text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-pahlavi-gold">•</span>
                  {t("tokenomics.notice1")}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pahlavi-gold">•</span>
                  {t("tokenomics.notice2")}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pahlavi-gold">•</span>
                  {t("tokenomics.notice3")}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pahlavi-gold">•</span>
                  {t("tokenomics.notice4")}
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default Tokenomics;
