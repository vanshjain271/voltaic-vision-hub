import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import ParticlesBackground from '@/components/ParticlesBackground';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Fixed admin credentials
    const ADMIN_EMAIL = "admin@thenetwork.com";
    const ADMIN_PASSWORD = "network@2024";

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      try {
        const result = await signIn(email, password);
        if (result.error) {
          toast({
            title: "Error",
            description: result.error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Success",
            description: "Successfully signed in as Admin!",
          });
          navigate('/');
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "An unexpected error occurred",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Access Denied",
        description: "Invalid admin credentials. Only club heads can login.",
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-orbitron">
      <ParticlesBackground />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Back to Home Button */}
          <Button
            variant="ghost"
            className="mb-6 text-muted-foreground hover:text-primary"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          <Card className="glass-card border-glass-border">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl neon-text mb-2">
                Welcome to The Network
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Admin Authentication Portal
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Admin Login - Only Club Heads
                  </p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Admin Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@thenetwork.com"
                      required
                      className="glass-card border-glass-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="glass-card border-glass-border pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full btn-neon"
                    disabled={loading}
                  >
                    {loading ? 'Signing In...' : 'Sign In as Admin'}
                  </Button>
                </form>
              </div>
            </CardContent>

            <CardFooter className="text-center">
              <p className="text-sm text-muted-foreground">
                By continuing, you agree to our terms and conditions
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;