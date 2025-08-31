import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import ParticlesBackground from '@/components/ParticlesBackground';
import Hero from '@/components/Hero';
import { DynamicGallery } from '@/components/DynamicGallery';
import { EventsSection } from '@/components/EventsSection';
import { SponsorsSection } from '@/components/SponsorsSection';
import About from '@/components/About';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Auto-redirect authenticated users from auth page
  useEffect(() => {
    if (!loading && user && window.location.pathname === '/auth') {
      navigate('/');
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-background text-foreground font-orbitron">
      {/* Animated Background */}
      <ParticlesBackground />
      
      {/* Navigation */}
      <Navigation />
      
      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Section */}
        <Hero />
        
        {/* Dynamic Gallery Section */}
        <DynamicGallery />
        
        {/* Events Section */}
        <EventsSection />
        
        {/* Sponsors Section */}
        <SponsorsSection />
        
        {/* About Section */}
        <About />
      </main>
      
      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-glass-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="neon-text text-xl font-bold mb-4">THE NETWORK</div>
            <p className="text-muted-foreground mb-4">
              Originality • Intent • Opportunity
            </p>
            <div className="text-sm text-muted-foreground">
              © 2024 The Network. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
