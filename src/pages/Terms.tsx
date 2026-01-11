import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="font-display text-4xl md:text-5xl text-foreground mb-8 tracking-wide">
              Terms of Service
            </h1>
            
            <div className="prose prose-invert max-w-none space-y-8 text-muted-foreground font-sans">
              <p className="text-lg leading-relaxed">
                Last updated: January 2026
              </p>

              <section className="space-y-4">
                <h2 className="font-display text-2xl text-foreground tracking-wide">1. Acceptance of Terms</h2>
                <p>
                  By accessing and using cyrus.cash and participating in the CYRUS token ecosystem, 
                  you agree to be bound by these Terms of Service. If you do not agree to these terms, 
                  please do not use our services.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="font-display text-2xl text-foreground tracking-wide">2. Nature of CYRUS Token</h2>
                <p>
                  CYRUS is a community meme token created to honor the legacy of Cyrus the Great. 
                  <strong className="text-foreground"> CYRUS is NOT a security, investment contract, 
                  or financial instrument.</strong>
                </p>
                <p>
                  There is no promise, expectation, or guarantee of appreciation in value. CYRUS tokens 
                  are intended solely for community participation and governance within the Cyrus DAO 
                  ecosystem.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="font-display text-2xl text-foreground tracking-wide">3. Token Distribution</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>50% — Cyrus DAO Treasury (community-governed)</li>
                  <li>10% — Initial Liquidity Pool on Base blockchain</li>
                  <li>40% — Year-long auction distribution</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="font-display text-2xl text-foreground tracking-wide">4. Risks</h2>
                <p>
                  Cryptocurrency and digital tokens involve significant risks including, but not limited to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Complete loss of value</li>
                  <li>Market volatility</li>
                  <li>Regulatory uncertainty</li>
                  <li>Technical vulnerabilities</li>
                  <li>Liquidity risks</li>
                </ul>
                <p>
                  You acknowledge that you participate at your own risk and have conducted your own 
                  research before acquiring any tokens.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="font-display text-2xl text-foreground tracking-wide">5. Jurisdiction</h2>
                <p>
                  CYRUS tokens are not available to residents of jurisdictions where their purchase, 
                  sale, or holding is prohibited by law. It is your responsibility to ensure compliance 
                  with your local laws and regulations.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="font-display text-2xl text-foreground tracking-wide">6. No Liability</h2>
                <p>
                  The Cyrus Foundation, its founders, contributors, and affiliates shall not be liable 
                  for any losses, damages, or claims arising from your use of the CYRUS token or 
                  participation in the ecosystem.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="font-display text-2xl text-foreground tracking-wide">7. Changes to Terms</h2>
                <p>
                  We reserve the right to modify these terms at any time. Continued use of our services 
                  constitutes acceptance of any changes.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="font-display text-2xl text-foreground tracking-wide">8. Contact</h2>
                <p>
                  For questions about these Terms, please contact the Cyrus Foundation at{" "}
                  <a href="https://cyrus.ngo" className="text-pahlavi-gold hover:underline">
                    cyrus.ngo
                  </a>
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
