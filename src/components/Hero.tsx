const Hero = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Logo */}
        <div className="mb-12 animate-slide-in">
          <img
            src="/lovable-uploads/2e32e8e2-a824-49a8-a0dc-1066eb2e770e.png"
            alt="The Network Logo"
            className="mx-auto max-w-md w-full h-auto neon-glow animate-pulse-glow"
          />
        </div>

        {/* Welcome Text */}
        <div className="space-y-6 animate-slide-in" style={{ animationDelay: '0.3s' }}>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Welcome to{' '}
            <span className="neon-text">The Network</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Originality • Intent • Opportunity
          </p>
          
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Discover the future through our digital gallery of cutting-edge visuals and innovative experiences.
          </p>
        </div>

        {/* CTA Button */}
        <div className="mt-12 animate-slide-in" style={{ animationDelay: '0.6s' }}>
          <a
            href="#gallery"
            className="inline-flex items-center px-8 py-4 text-lg font-medium rounded-full btn-neon transition-all hover:scale-105"
          >
            Explore Gallery
          </a>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-pulse">
          <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
            <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;