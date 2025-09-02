import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import ParticlesBackground from '@/components/ParticlesBackground';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import About from '@/components/About';
import LoadingLogo from '@/components/LoadingLogo';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showLoading, setShowLoading] = useState(true);
  const [loadingComplete, setLoadingComplete] = useState(false);

  useEffect(() => {
    // Redirect authenticated users from auth page to home
    if (user && window.location.pathname === '/auth') {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLoadingComplete = () => {
    setLoadingComplete(true);
    setTimeout(() => {
      setShowLoading(false);
    }, 500);
  };

  if (showLoading) {
    return <LoadingLogo onComplete={handleLoadingComplete} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <ParticlesBackground />
      <Navigation />
      
      <main className="relative">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center pt-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Network Logo - 3D positioned top-left */}
            <div className="absolute top-8 left-8 animate-fade-in">
              <img
                src="/lovable-uploads/2e32e8e2-a824-49a8-a0dc-1066eb2e770e.png"
                alt="The Network Logo"
                className="w-24 h-24 object-contain"
                style={{
                  filter: 'drop-shadow(0 0 10px hsl(var(--primary) / 0.3))',
                  transform: 'perspective(500px) rotateY(-15deg) rotateX(5deg)',
                }}
              />
            </div>

            {/* Club Logo - Prominent Display */}
            <div className="mb-12 animate-fade-in">
              <div className="relative">
                <img
                  src="/lovable-uploads/2e32e8e2-a824-49a8-a0dc-1066eb2e770e.png"
                  alt="Club Logo"
                  className="mx-auto max-w-md w-full h-auto hover-scale transition-transform duration-500"
                  style={{
                    filter: 'drop-shadow(0 0 20px hsl(var(--primary) / 0.4))',
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/10 to-transparent rounded-lg" />
              </div>
            </div>

            {/* Welcome Text */}
            <div className="space-y-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                Welcome to{' '}
                <span className="neon-text">
                  The Network
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Connect • Learn • Grow Together
              </p>
              
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                {user 
                  ? `Welcome back! Explore our community and stay updated with latest events.`
                  : `Join our vibrant community of learners and innovators. Discover events, connect with members, and be part of something amazing.`
                }
              </p>
            </div>

            {/* CTA Buttons */}
            {!user && (
              <div className="mt-12 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                <button
                  onClick={() => navigate('/join')}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-medium rounded-full transition-all hover:scale-105"
                >
                  Join The Network
                </button>
              </div>
            )}

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-pulse">
              <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
                <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-bounce"></div>
              </div>
            </div>
          </div>
        </section>
        
        {/* About Section */}
        <section className="py-20 bg-muted/50">
          <About />
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-background border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 The Network. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;