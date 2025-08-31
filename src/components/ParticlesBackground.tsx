import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  delay: number;
  duration: number;
}

const ParticlesBackground = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const particleCount = 50;
    const newParticles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 20,
        duration: 15 + Math.random() * 10,
      });
    }

    setParticles(newParticles);
  }, []);

  return (
    <div className="particles">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.x}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}
      
      {/* Additional gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-neon-blue/5 via-transparent to-electric-purple/5 pointer-events-none" />
      
      {/* Radial gradient for center focus */}
      <div className="fixed inset-0 bg-gradient-radial from-transparent via-transparent to-background/20 pointer-events-none" />
    </div>
  );
};

export default ParticlesBackground;