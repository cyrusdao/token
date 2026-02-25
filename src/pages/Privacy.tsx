import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Privacy = () => {
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
              Privacy Policy
            </h1>
            
            <div className="prose prose-invert max-w-none space-y-8 text-muted-foreground font-sans">
              <p className="text-lg leading-relaxed">
                Last updated: January 2026
              </p>

              <section className="space-y-4">
                <h2 className="font-display text-2xl text-foreground tracking-wide">1. Introduction</h2>
                <p>
                  The Cyrus Foundation ("we," "our," or "us") respects your privacy and is committed 
                  to protecting your personal information. This Privacy Policy explains how we collect, 
                  use, and safeguard information when you visit cyrus.money.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="font-display text-2xl text-foreground tracking-wide">2. Information We Collect</h2>
                <p>
                  <strong className="text-foreground">Blockchain Data:</strong> When you interact with 
                  the CYRUS token, your wallet address and transaction history are recorded on the 
                  public Base blockchain. This data is publicly accessible and not controlled by us.
                </p>
                <p>
                  <strong className="text-foreground">Website Analytics:</strong> We may collect 
                  anonymous usage data such as page views, referral sources, and general geographic 
                  location to improve our website.
                </p>
                <p>
                  <strong className="text-foreground">Voluntary Information:</strong> If you contact 
                  us or join our community channels, you may voluntarily provide information such as 
                  your email address or social media handles.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="font-display text-2xl text-foreground tracking-wide">3. How We Use Information</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>To improve our website and user experience</li>
                  <li>To respond to your inquiries</li>
                  <li>To provide updates about the CYRUS ecosystem (with your consent)</li>
                  <li>To comply with legal obligations</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="font-display text-2xl text-foreground tracking-wide">4. Cookies</h2>
                <p>
                  We may use cookies and similar technologies to enhance your browsing experience. 
                  You can control cookie preferences through your browser settings.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="font-display text-2xl text-foreground tracking-wide">5. Third-Party Services</h2>
                <p>
                  Our website may contain links to third-party websites and services. We are not 
                  responsible for the privacy practices of these external sites. We encourage you 
                  to review their privacy policies.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="font-display text-2xl text-foreground tracking-wide">6. Data Security</h2>
                <p>
                  We implement reasonable security measures to protect any personal information we 
                  collect. However, no method of transmission over the internet is 100% secure.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="font-display text-2xl text-foreground tracking-wide">7. Your Rights</h2>
                <p>
                  Depending on your jurisdiction, you may have rights regarding your personal data, 
                  including access, correction, deletion, and data portability. Contact us to exercise 
                  these rights.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="font-display text-2xl text-foreground tracking-wide">8. Changes to This Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. Changes will be posted on this 
                  page with an updated revision date.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="font-display text-2xl text-foreground tracking-wide">9. Contact</h2>
                <p>
                  For questions about this Privacy Policy, please contact the Cyrus Foundation at{" "}
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

export default Privacy;
