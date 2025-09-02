import { useState, useEffect } from 'react';

interface LoadingLogoProps {
  onComplete: () => void;
}

const LoadingLogo = ({ onComplete }: LoadingLogoProps) => {
  const [stage, setStage] = useState<'loading' | 'complete'>('loading');

  useEffect(() => {
    const timer = setTimeout(() => {
      setStage('complete');
      onComplete();
    }, 2500);

    return () => {
      clearTimeout(timer);
    };
  }, [onComplete]);

  if (stage === 'complete') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="relative">
        <div className="animate-fade-in">
          <img
            src="/lovable-uploads/2e32e8e2-a824-49a8-a0dc-1066eb2e770e.png"
            alt="The Network Logo"
            className="w-48 h-48 object-contain neon-glow"
            style={{
              filter: 'drop-shadow(0 0 25px hsl(var(--primary) / 0.6))',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/15 to-transparent rounded-lg" />
        </div>
        
        <div className="mt-8 text-center">
          <div className="text-3xl font-bold neon-text animate-pulse">
            The Network
          </div>
          <div className="text-sm text-muted-foreground mt-2 animate-fade-in">
            Loading Digital Experience...
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingLogo;