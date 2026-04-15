import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: string })?.from || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      const lowerMessage = error.message.toLowerCase();
      toast.error('Login failed', {
        description: lowerMessage.includes('invalid login credentials')
          ? 'Invalid login credentials. Please confirm your email if you just registered.'
          : error.message,
      });
      setLoading(false);
    } else {
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden
      bg-gradient-to-br from-background via-orange-50 to-background">

      {/* 🔥 Glow Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-120px] left-[-120px] w-[320px] h-[320px] bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[-120px] right-[-120px] w-[320px] h-[320px] bg-orange-300/20 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Welcome Back 👋
          </h1>
          <p className="text-muted-foreground">
            Login to continue exploring Hyderabad
          </p>
        </div>

        {/* Card */}
        <Card className="border-none shadow-2xl backdrop-blur-xl bg-white/80 border border-white/20">
          <CardContent className="p-8">

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11 focus-visible:ring-2 focus-visible:ring-primary/50"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 focus-visible:ring-2 focus-visible:ring-primary/50"
                />
              </div>

              {/* Button */}
              <Button
                type="submit"
                className="w-full h-11 text-base transition-all hover:scale-[1.02] hover:shadow-lg"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>

            </form>

            {/* Divider */}
            <div className="my-6 border-t" />

            {/* Register */}
            <p className="text-center text-sm text-muted-foreground">
              Don’t have an account?{' '}
              <Link
                to="/register"
                className="text-primary font-medium hover:underline"
              >
                Register here
              </Link>
            </p>

          </CardContent>
        </Card>

      </div>
    </div>
  );
}