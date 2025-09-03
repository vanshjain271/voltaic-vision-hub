import { Users, Target, Lightbulb, Zap } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: Lightbulb,
      title: 'Originality',
      description: 'Pioneering unique concepts and innovative approaches that set new standards in digital experiences.',
    },
    {
      icon: Target,
      title: 'Intent',
      description: 'Every project is crafted with purpose, driven by clear vision and strategic thinking.',
    },
    {
      icon: Zap,
      title: 'Opportunity',
      description: 'Seizing moments to create breakthrough solutions that transform ideas into reality.',
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'Building strong networks of creative minds working together towards shared goals.',
    },
  ];

  return (
    <section id="about" className="py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-slide-in">
          <h2 className="text-4xl font-bold mb-6 neon-text">About The Network</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We are a collective of digital innovators, creators, and visionaries united by a common purpose: 
            to push the boundaries of what's possible in the digital realm.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="glass-card rounded-xl p-6 text-center group hover:neon-glow transition-all duration-300 animate-slide-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-8 h-8 neon-text" />
              </div>
              
              <h3 className="text-xl font-bold mb-4 text-foreground">
                {feature.title}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Mission Statement */}
        <div className="mt-20 text-center">
          <div className="glass-card rounded-2xl p-12 neon-glow animate-slide-in">
            <h3 className="text-3xl font-bold mb-6 neon-text">Our Mission</h3>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-4xl mx-auto">
              At The Network, we believe in the power of collective intelligence and creative collaboration. 
              Our mission is to create a platform where originality thrives, intent drives action, and 
              opportunities are transformed into groundbreaking digital experiences that shape the future.
            </p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-16 glass-card rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-center mb-8 neon-text">Contact Us</h3>
          
          {/* Leadership Team */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div className="text-center">
              <h4 className="text-xl font-semibold mb-2">President</h4>
              <p className="text-lg text-muted-foreground mb-2">Kanishka Rajput</p>
              <p className="text-primary font-mono">7861004578</p>
            </div>
            <div className="text-center">
              <h4 className="text-xl font-semibold mb-2">Vice President</h4>
              <p className="text-lg text-muted-foreground mb-2">Tanisha Jain</p>
              <p className="text-primary font-mono">9327602730</p>
            </div>
            <div className="text-center">
              <h4 className="text-xl font-semibold mb-2">Treasurer</h4>
              <p className="text-lg text-muted-foreground mb-2">Lakshay Sharaf</p>
              <p className="text-primary font-mono">7096688709</p>
            </div>
            <div className="text-center">
              <h4 className="text-xl font-semibold mb-2">Tech Head</h4>
              <p className="text-lg text-muted-foreground mb-2">Vansh Jain</p>
              <p className="text-primary font-mono">6355781137</p>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="border-t border-glass-border pt-6">
            <h4 className="text-lg font-semibold text-center mb-4">Follow Us</h4>
            <div className="flex justify-center items-center gap-6">
              <a
                href="https://www.instagram.com/thenetwork_pdeu/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                Instagram
              </a>
              <a
                href="mailto:contact@thenetwork.com"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email
              </a>
              <a
                href="https://linkedin.com/company/thenetwork-pdeu"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;