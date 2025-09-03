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
      {/* Animated Network Grid Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        {/* Grid Lines */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: 'network-pulse 2s ease-in-out infinite'
          }}
        />
        {/* Floating Network Nodes */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary rounded-full opacity-60"
            style={{
              left: `${15 + (i * 7)}%`,
              top: `${20 + (i % 3) * 25}%`,
              animation: `network-float ${2 + (i * 0.3)}s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10">
        <div className="animate-fade-in">
          <div className="relative">
            <img
              src="/lovable-uploads/2e32e8e2-a824-49a8-a0dc-1066eb2e770e.png"
              alt="The Network Logo"
              className="w-48 h-48 object-contain"
              style={{
                filter: `
                  drop-shadow(0 0 30px hsl(var(--primary) / 0.8))
                  drop-shadow(0 0 60px hsl(var(--accent) / 0.4))
                  brightness(1.1)
                  contrast(1.2)
                `,
                animation: 'logo-glow 2.5s ease-in-out infinite'
              }}
            />
            {/* Circular Network Connections */}
            <div 
              className="absolute inset-0 border-2 border-primary/30 rounded-full"
              style={{ animation: 'network-ring 3s linear infinite' }}
            />
            <div 
              className="absolute inset-4 border border-accent/20 rounded-full"
              style={{ animation: 'network-ring 3s linear infinite reverse' }}
            />
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <div className="text-3xl font-bold neon-text animate-pulse">
            The Network
          </div>
          <div className="text-sm text-muted-foreground mt-2 animate-fade-in">
            <span className="inline-flex items-center gap-2">
              Connecting Digital Minds
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
              </div>
            </span>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes network-pulse {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.02); }
        }
        
        @keyframes network-float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-10px) scale(1.2); }
        }
        
        @keyframes logo-glow {
          0%, 100% { 
            filter: drop-shadow(0 0 30px hsl(var(--primary) / 0.8)) drop-shadow(0 0 60px hsl(var(--accent) / 0.4)) brightness(1.1) contrast(1.2);
          }
          50% { 
            filter: drop-shadow(0 0 45px hsl(var(--primary) / 1)) drop-shadow(0 0 90px hsl(var(--accent) / 0.6)) brightness(1.3) contrast(1.4);
          }
        }
        
        @keyframes network-ring {
          0% { transform: rotate(0deg) scale(1); opacity: 0.3; }
          50% { opacity: 0.6; }
          100% { transform: rotate(360deg) scale(1.1); opacity: 0.3; }
        }
      `}</style>
    </div>
  );
};

export default LoadingLogo;