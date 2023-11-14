import { Navigate } from 'react-router-dom';

import Header from './Header';
import Hero from './Hero';
import Features from './Features';
import TeamMembers from './TeamMembers';
import Footer from './Footer';

import useAuth from '@/hooks/useAuth';

function LandingPage() {
  const { user_id } = useAuth();

  if (user_id) {
    return <Navigate to="/home" />;
  }

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
