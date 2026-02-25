import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Buy from "@/components/Buy";
import Philosophy from "@/components/Philosophy";
import PersianEmpire from "@/components/PersianEmpire";
import Diaspora from "@/components/Diaspora";
import Principles from "@/components/Principles";
import HowToHelp from "@/components/HowToHelp";
import Tokenomics from "@/components/Tokenomics";
import Governance from "@/components/Governance";
import Leadership from "@/components/Leadership";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Buy />
      <Philosophy />
      <PersianEmpire />
      <Diaspora />
      <Principles />
      <HowToHelp />
      <Tokenomics />
      <Governance />
      <Leadership />
      <FAQ />
      <Footer />
    </div>
  );
};

export default Index;
