import Navigation from '@/components/Navigation';
import ParticlesBackground from '@/components/ParticlesBackground';
import Hero from '@/components/Hero';
import Gallery from '@/components/Gallery';
import About from '@/components/About';

const Index = () => {
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
        
        {/* Gallery Section */}
        <Gallery />
        
        {/* About Section */}
        <About />
        
        {/* Admin Section Placeholder */}
        <section id="admin" className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="glass-card rounded-2xl p-12 neon-glow animate-slide-in">
              <h2 className="text-4xl font-bold mb-6 neon-text">Admin Portal</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Administrative access for content management and system controls.
              </p>
              <div className="text-sm text-muted-foreground">
                Coming Soon - Full admin functionality will be implemented
              </div>
            </div>
          </div>
        </section>
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
