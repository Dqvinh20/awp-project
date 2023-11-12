import Header from './Header';
import Hero from './Hero';
import Features from './Features';
import TeamMembers from './TeamMembers';
import Footer from './Footer';

function LandingPage() {
  return (
    <div className="twp h-screen max-w-full text-base">
      <Header />
      <Hero />
      <Features />
      <TeamMembers />
      <Footer />
    </div>
  );
}

export default LandingPage;
