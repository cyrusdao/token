import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, BookOpen, Palette, Globe, Heart, Users, Building } from "lucide-react";

const initiatives = [
  {
    icon: BookOpen,
    title: "Persian Studies & Education",
    description:
      "Scholarships for students studying Persian history, language, and archaeology. Translations of ancient texts and academic research support.",
  },
  {
    icon: Palette,
    title: "Arts & Cultural Heritage",
    description:
      "Supporting Persian artists, musicians, and craftspeople. Funding preservation of heritage sites and traditional art forms.",
  },
  {
    icon: Globe,
    title: "Spreading Cyrus's Message",
    description:
      "Educational campaigns about religious tolerance and human rights. Documentaries, publications, and global outreach programs.",
  },
  {
    icon: Heart,
    title: "Humanitarian Aid",
    description:
      "Supporting communities in need through the Cyrus Foundation. Food security, healthcare access, and disaster relief efforts.",
  },
  {
    icon: Users,
    title: "Diaspora Community",
    description:
      "Building connections among the global Persian diaspora. Cultural events, networking, and community building initiatives.",
  },
  {
    icon: Building,
    title: "Rebuilding & Development",
    description:
      "Supporting infrastructure and development projects that benefit Iranian communities and preserve cultural landmarks.",
  },
];

const HowToHelp = () => {
  return (
    <section id="help" className="py-32 bg-background relative overflow-hidden">
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
            DAO Treasury
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mt-4 tracking-wide text-balance">
            What the DAO
            <span className="text-gradient-gold"> Supports</span>
          </h2>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-center max-w-2xl mx-auto text-muted-foreground font-sans text-lg mb-20"
        >
          50% of all CYRUS tokens are held in the Cyrus DAO treasury. Token holders 
          vote on how these funds are allocated to support cultural and humanitarian initiatives.
        </motion.p>

        {/* Initiatives grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {initiatives.map((initiative, index) => (
            <motion.div
              key={initiative.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
            >
              <Card className="bg-card/50 glass-border hover:bg-card/80 transition-all duration-500 h-full group">
                <CardContent className="p-8">
                  <div className="mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-secondary/80 flex items-center justify-center group-hover:bg-pahlavi-gold/10 transition-colors duration-500">
                      <initiative.icon className="w-5 h-5 text-pahlavi-gold" />
                    </div>
                  </div>
                  
                  <h3 className="font-display text-xl text-foreground mb-3 tracking-wide">
                    {initiative.title}
                  </h3>
                  
                  <p className="text-muted-foreground font-sans text-sm leading-relaxed">
                    {initiative.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-24"
        >
          <Card className="bg-gradient-card glass-border shadow-gold overflow-hidden">
            <CardContent className="p-12 md:p-16 text-center relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pahlavi-gold/5 to-transparent" />
              
              <div className="relative z-10">
                <h3 className="font-display text-3xl md:text-4xl text-foreground mb-4 tracking-wide">
                  Your Voice Matters
                </h3>
                <p className="text-muted-foreground font-sans text-lg mb-10 max-w-2xl mx-auto">
                  Hold CYRUS tokens to participate in governance. Vote on proposals, 
                  submit initiatives, and help shape how the DAO treasury supports 
                  Persian heritage and humanitarian causes.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="gold" size="lg">
                    Join the Auction
                  </Button>
                  <Button variant="gold-outline" size="lg" asChild>
                    <a href="https://cyrus.vote" target="_blank" rel="noopener noreferrer">
                      Visit cyrus.vote
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default HowToHelp;
