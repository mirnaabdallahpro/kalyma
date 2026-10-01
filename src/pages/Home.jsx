import CommerceOffersSection from "../components/landing/CommerceOffersSection";
import DifferentiatorsSection from "../components/landing/DifferentiatorsSection";
import FinalCTA from "../components/landing/FinalCTA";
import Footer from "../components/landing/Footer";
import Hero from "../components/landing/Hero";
import JourneyPath from "../components/landing/JourneyPath";
import Nav from "../components/landing/Nav";
import OffersDetailSection from "../components/landing/OffersDetailSection";
import PillarsSection from "../components/landing/PillarsSection";
import ProblemSection from "../components/landing/ProblemSection";
import SocialProofSection from "../components/landing/SocialProofSection";
import "../styles/landing.css";

function Home() {
  return (
    <div className="lp-body">
      <Nav />
      <Hero />
      <ProblemSection />
      <PillarsSection />
      <JourneyPath />
      <OffersDetailSection />
      <CommerceOffersSection />
      <DifferentiatorsSection />
      <SocialProofSection />
      <FinalCTA />
      <Footer />
    </div>
  );
}

export default Home;
