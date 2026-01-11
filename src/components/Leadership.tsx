import { motion } from "framer-motion";
import { Linkedin, Instagram, Globe } from "lucide-react";

interface TeamMember {
  name: string;
  nameFa: string;
  role: string;
  roleFa: string;
  image: string;
  bio: string;
  bioFa: string;
  links: {
    website?: string;
    linkedin?: string;
    instagram?: string;
  };
}

const teamMembers: TeamMember[] = [
  {
    name: "Cyrus Pahlavi",
    nameFa: "سایروس پهلوی",
    role: "Founding Chair",
    roleFa: "رئیس بنیان‌گذار",
    image: "/assets/images/cyrus-pahlavi.png",
    bio: "Leading the CYRUS Foundation with a vision of uniting the Persian diaspora and preserving our cultural heritage for future generations.",
    bioFa: "رهبری بنیاد سایروس با چشم‌انداز متحد کردن ایرانیان در سراسر جهان و حفظ میراث فرهنگی ما برای نسل‌های آینده.",
    links: {
      website: "https://www.cyruspahlavi.com/about",
      instagram: "https://www.instagram.com/cyruspahlavi",
      linkedin: "https://www.linkedin.com/in/cyruspahlavi",
    },
  },
  {
    name: "Kamran Pahlavi",
    nameFa: "کامران پهلوی",
    role: "Board Member",
    roleFa: "عضو هیئت مدیره",
    image: "/assets/images/kamran-pahlavi.jpg",
    bio: "Dedicated to advancing Persian cultural initiatives and supporting the global Iranian community through strategic leadership.",
    bioFa: "متعهد به پیشبرد ابتکارات فرهنگی ایرانی و حمایت از جامعه جهانی ایرانیان از طریق رهبری استراتژیک.",
    links: {
      instagram: "https://www.instagram.com/kamranpahlavi",
    },
  },
  {
    name: "Dara Gallopin",
    nameFa: "دارا گالوپین",
    role: "Creative Officer",
    roleFa: "مدیر خلاقیت",
    image: "/assets/images/dara-gallopin.png",
    bio: "Bringing creative vision to the CYRUS brand, ensuring our message resonates with Persians worldwide through compelling storytelling and design.",
    bioFa: "آوردن چشم‌انداز خلاقانه به برند سایروس، اطمینان از اینکه پیام ما از طریق داستان‌سرایی و طراحی جذاب با ایرانیان سراسر جهان همخوانی دارد.",
    links: {
      website: "https://www.daragallopin.com/",
      instagram: "https://www.instagram.com/daragallopin",
      linkedin: "https://www.linkedin.com/in/daragallopin",
    },
  },
];

const Leadership = () => {
  return (
    <section id="leadership" className="relative py-24 overflow-hidden bg-background">
      {/* Background pattern */}
      <div className="absolute inset-0 geometric-pattern opacity-30" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-block font-mono text-[11px] tracking-[0.2em] uppercase text-muted-foreground mb-4">
            Founding Team
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-foreground mb-4">
            <span className="text-gradient-gold">Leadership</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The CYRUS Foundation is led by dedicated individuals committed to the
            preservation of Persian heritage and the empowerment of the global diaspora.
            Initial stewardship by the Pahlavi family with planned transition to
            full public governance.
          </p>
        </motion.div>

        {/* Team Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group"
            >
              <div className="glass glass-border rounded-2xl p-6 h-full flex flex-col items-center text-center transition-all duration-300 hover:border-pahlavi-gold/30">
                {/* Photo */}
                <div className="relative w-32 h-32 mb-6 rounded-full overflow-hidden border-2 border-pahlavi-gold/20 group-hover:border-pahlavi-gold/50 transition-colors">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Name & Role */}
                <h3 className="font-display text-xl text-foreground mb-1">
                  {member.name}
                </h3>
                <p className="font-mono text-xs tracking-wider text-pahlavi-gold uppercase mb-4">
                  {member.role}
                </p>

                {/* Bio */}
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-grow">
                  {member.bio}
                </p>

                {/* Social Links */}
                <div className="flex gap-3">
                  {member.links.website && (
                    <a
                      href={member.links.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full glass glass-border hover:border-pahlavi-gold/50 transition-colors"
                      aria-label={`${member.name}'s website`}
                    >
                      <Globe className="w-4 h-4 text-muted-foreground hover:text-pahlavi-gold transition-colors" />
                    </a>
                  )}
                  {member.links.linkedin && (
                    <a
                      href={member.links.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full glass glass-border hover:border-pahlavi-gold/50 transition-colors"
                      aria-label={`${member.name}'s LinkedIn`}
                    >
                      <Linkedin className="w-4 h-4 text-muted-foreground hover:text-pahlavi-gold transition-colors" />
                    </a>
                  )}
                  {member.links.instagram && (
                    <a
                      href={member.links.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full glass glass-border hover:border-pahlavi-gold/50 transition-colors"
                      aria-label={`${member.name}'s Instagram`}
                    >
                      <Instagram className="w-4 h-4 text-muted-foreground hover:text-pahlavi-gold transition-colors" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Governance Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="glass glass-border rounded-xl p-6 max-w-2xl mx-auto">
            <p className="text-muted-foreground text-sm">
              <span className="text-pahlavi-gold font-semibold">Public Stewardship:</span>{" "}
              The founding board, led by members of the Pahlavi family, will guide CYRUS
              through its first two years. Additional board members may be selected at
              board discretion. A planned transition to full public governance will follow,
              ensuring the community ultimately controls its own destiny.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Leadership;
