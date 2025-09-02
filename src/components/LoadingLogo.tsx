import { useState, useEffect } from 'react';

interface LoadingLogoProps {
  onComplete: () => void;
}

const LoadingLogo = ({ onComplete }: LoadingLogoProps) => {
  const [stage, setStage] = useState<'skeleton' | 'logo' | 'complete'>('skeleton');

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setStage('logo');
    }, 1500);

    const timer2 = setTimeout(() => {
      setStage('complete');
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  if (stage === 'complete') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="relative">
        {stage === 'skeleton' ? (
          <div className="animate-spin">
            <div className="w-32 h-32 border-4 border-primary/20 border-t-primary rounded-full animate-pulse" />
          </div>
        ) : (
          <div className="animate-fade-in">
            <img
              src="/lovable-uploads/2e32e8e2-a824-49a8-a0dc-1066eb2e770e.png"
              alt="The Network Logo"
              className="w-48 h-48 object-contain neon-glow animate-pulse-glow"
              style={{
                filter: 'drop-shadow(0 0 20px hsl(var(--primary) / 0.5))',
                transform: 'perspective(1000px) rotateY(10deg) rotateX(5deg)',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/10 to-transparent rounded-lg" />
          </div>
        )}
        
        <div className="mt-8 text-center">
          <div className="text-2xl font-bold neon-text animate-pulse">
            {stage === 'skeleton' ? 'Loading...' : 'The Network'}
          </div>
          <div className="text-sm text-muted-foreground mt-2">
            Initializing Digital Experience
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingLogo;