import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'tourist' | 'local'>('tourist');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error, pendingConfirmation } = await signUp(email, password, name, userType);

    if (error) {
      toast.error('Registration failed', {
        description: error.message,
      });
      setLoading(false);
    } else {
      toast.success('Account created successfully!', {
        description: pendingConfirmation
          ? 'Please confirm your email first, then login with your credentials.'
          : 'You can now login with your credentials.',
      });
      navigate('/login');
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
            Create Account 🚀
          </h1>
          <p className="text-muted-foreground">
            Join us to explore Hyderabad
          </p>
        </div>

        {/* Card */}
        <Card className="border-none shadow-2xl backdrop-blur-xl bg-white/80 border border-white/20">
          <CardContent className="p-8">

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-11 focus-visible:ring-2 focus-visible:ring-primary/50"
                />
              </div>

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
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="h-11 focus-visible:ring-2 focus-visible:ring-primary/50"
                />
              </div>

              {/* User Type */}
              <div className="space-y-3">
                <Label>I am a</Label>

                <RadioGroup
                  value={userType}
                  onValueChange={(value) =>
                    setUserType(value as 'tourist' | 'local')
                  }
                  className="grid grid-cols-2 gap-4"
                >
                  {/* Tourist */}
                  <Label
                    htmlFor="tourist"
                    className={`flex items-center gap-2 border rounded-lg p-3 cursor-pointer transition 
                    ${userType === 'tourist'
                        ? 'border-primary bg-primary/10'
                        : 'hover:bg-accent'
                      }`}
                  >
                    <RadioGroupItem value="tourist" id="tourist" />
                    Tourist
                  </Label>

                  {/* Local */}
                  <Label
                    htmlFor="local"
                    className={`flex items-center gap-2 border rounded-lg p-3 cursor-pointer transition 
                    ${userType === 'local'
                        ? 'border-primary bg-primary/10'
                        : 'hover:bg-accent'
                      }`}
                  >
                    <RadioGroupItem value="local" id="local" />
                    Local
                  </Label>
                </RadioGroup>
              </div>

              {/* Button */}
              <Button
                type="submit"
                className="w-full h-11 text-base transition-all hover:scale-[1.02] hover:shadow-lg"
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Register'}
              </Button>

            </form>

            {/* Divider */}
            <div className="my-6 border-t" />

            {/* Login Link */}
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-primary font-medium hover:underline"
              >
                Login here
              </Link>
            </p>

          </CardContent>
        </Card>

      </div>
    </div>
  );
}