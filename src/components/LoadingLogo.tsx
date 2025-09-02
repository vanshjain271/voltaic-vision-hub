import { useState, useEffect } from 'react';

interface LoadingLogoProps {
  onComplete: () => void;
}

const LoadingLogo = ({ onComplete }: LoadingLogoProps) => {
  const [stage, setStage] = useState<'circle' | 'rotating' | 'logo' | 'complete'>('circle');

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setStage('rotating');
    }, 800);

    const timer2 = setTimeout(() => {
      setStage('logo');
    }, 2000);

    const timer3 = setTimeout(() => {
      setStage('complete');
      onComplete();
    }, 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  if (stage === 'complete') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="relative">
        {stage === 'circle' && (
          <div className="w-32 h-32 border-4 border-primary/30 border-t-primary rounded-full animate-pulse" />
        )}
        
        {stage === 'rotating' && (
          <div className="w-32 h-32 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        )}
        
        {stage === 'logo' && (
          <div className="animate-fade-in">
            <picture>
              <source srcSet="/lovable-uploads/2e32e8e2-a824-49a8-a0dc-1066eb2e770e.png" type="image/webp" />
              <img
                src="/lovable-uploads/2e32e8e2-a824-49a8-a0dc-1066eb2e770e.png"
                alt="The Network Logo"
                className="w-48 h-48 object-contain neon-glow animate-pulse-glow"
                style={{
                  filter: 'drop-shadow(0 0 25px hsl(var(--primary) / 0.6))',
                  transform: 'perspective(1000px) rotateY(15deg) rotateX(8deg) rotateZ(2deg)',
                }}
              />
            </picture>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/15 to-transparent rounded-lg" />
            <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-accent/10 to-primary/5 rounded-lg" />
          </div>
        )}
        
        <div className="mt-8 text-center">
          <div className="text-3xl font-bold neon-text animate-pulse">
            {stage === 'circle' || stage === 'rotating' ? 'Loading...' : 'The Network'}
          </div>
          <div className="text-sm text-muted-foreground mt-2 animate-fade-in">
            {stage === 'logo' ? 'Welcome to the Digital Experience' : 'Initializing...'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingLogo;