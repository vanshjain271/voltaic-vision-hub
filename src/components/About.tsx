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

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { number: '100+', label: 'Projects Completed' },
            { number: '50+', label: 'Team Members' },
            { number: '25+', label: 'Awards Won' },
            { number: '5+', label: 'Years Experience' },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="text-center animate-slide-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-4xl font-bold neon-text mb-2">{stat.number}</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wide">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;