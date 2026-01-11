import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is CYRUS?",
    answer: "CYRUS is the official token of the PARS community, honoring the legacy of Cyrus the Great (Kourosh-e Bozorg). It unifies the global Persian diaspora—estimated at 8 million people worldwide—around shared heritage and the timeless principles of freedom, tolerance, and human dignity. Built on Base (Ethereum L2) with a fixed supply of 1 billion tokens.",
  },
  {
    question: "How do I get CYRUS tokens?",
    answer: "CYRUS tokens are sold through a quadratic bonding curve. The price starts at $0.01 and rises to $1.00 as more tokens are sold—early buyers get up to 100× more tokens for the same amount! To participate, you'll need USDT on Base blockchain and a compatible wallet like Coinbase Wallet or MetaMask.",
  },
  {
    question: "What is a bonding curve?",
    answer: "A bonding curve is a mathematical formula that determines token price based on supply. CYRUS uses a quadratic curve where price increases faster as more tokens are sold. This rewards early supporters while ensuring fair access for everyone. The price starts at $0.01 per token and ends at $1.00 (100× range).",
  },
  {
    question: "What blockchain is CYRUS on?",
    answer: "CYRUS is exclusively available on Base—an Ethereum Layer 2 blockchain built by Coinbase. Base offers low transaction fees, fast confirmations, and the security of Ethereum. You'll need ETH on Base for gas fees and USDT to purchase CYRUS tokens.",
  },
  {
    question: "What is the token distribution?",
    answer: "1 billion CYRUS tokens are distributed as: 50% to the DAO Treasury for community initiatives, 10% for initial Liquidity Pool on Base DEX, and 40% through the public sale via bonding curve. No team allocation. No VC rounds. No pre-sale. Everyone starts equal.",
  },
  {
    question: "What is the CYRUS DAO?",
    answer: "The CYRUS DAO is the decentralized governance body where token holders direct treasury funds. One token equals one vote. The DAO funds Persian language schools, cultural centers, heritage preservation, humanitarian initiatives, and community programs. All votes are recorded on-chain at cyrus.vote.",
  },
  {
    question: "Who founded CYRUS?",
    answer: "CYRUS was created by the PARS community and the Cyrus Foundation (cyrus.ngo). It is a community initiative by members of the Persian diaspora, dedicated to promoting the values of Cyrus the Great—religious freedom, human dignity, and cultural tolerance.",
  },
  {
    question: "Is CYRUS an investment?",
    answer: "No. CYRUS is a community token for coordination and governance, not a security or investment. There is NO expectation of financial gain or profit. Token value may go to zero. Only participate with funds you can afford to lose completely. Always do your own research.",
  },
  {
    question: "How do I buy with USDT?",
    answer: "First, ensure you have USDT on Base blockchain. Connect your wallet, enter the amount of USDT you want to spend, and click 'Buy CYRUS'. You'll first approve USDT spending, then confirm the purchase. The bonding curve will calculate how many tokens you receive based on the current price.",
  },
  {
    question: "Where can I trade CYRUS?",
    answer: "After the bonding curve completes, CYRUS will be tradeable on decentralized exchanges (DEXs) on Base blockchain. The 10% LP Reserve is used to seed initial liquidity. Always verify you're using the official contract address before trading.",
  },
  {
    question: "How can I participate in governance?",
    answer: "Holding CYRUS tokens gives you voting rights in the DAO. Visit cyrus.vote to view active proposals, discuss initiatives, and cast your votes. Proposals require 100,000+ CYRUS to submit, with quorum requirements from 5-20% depending on proposal type. All governance is transparent and on-chain.",
  },
];

const FAQ = () => {
  return (
    <section id="faq" className="py-32 bg-secondary/50 relative overflow-hidden">
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
            Questions
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mt-4 tracking-wide">
            Frequently
            <span className="text-gradient-gold"> Asked</span>
          </h2>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-center max-w-2xl mx-auto text-muted-foreground font-sans text-lg mb-16"
        >
          Everything you need to know about CYRUS, the auction, and the Cyrus DAO.
        </motion.p>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="glass glass-border rounded-xl px-6 border-none"
              >
                <AccordionTrigger className="text-left font-sans text-base text-foreground hover:text-pahlavi-gold hover:no-underline py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground font-sans text-sm leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
