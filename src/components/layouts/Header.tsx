import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Header() {
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/food', label: 'Food' },
    { path: '/places', label: 'Places' },
    { path: '/shopping', label: 'Shopping' },
    { path: '/entertainment', label: 'Entertainment' },
    { path: '/events', label: 'Events' },
    { path: '/culture', label: 'Culture' },
    { path: '/packages', label: 'Packages' },
    { path: '/contact', label: 'Contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleSignOut = async () => {
    await signOut();
    setOpen(false);
  };

  const desktopLinkClass = (path: string) =>
    `text-sm font-medium transition-colors ${
      isHomePage && !scrolled
        ? isActive(path)
          ? 'text-primary'
          : 'text-white/80 hover:text-white'
        : isActive(path)
          ? 'text-primary'
          : 'text-muted-foreground hover:text-primary'
    }`;

  const authButtonClass = isHomePage && !scrolled
    ? 'border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white'
    : undefined;

  const mobileTriggerClass = isHomePage && !scrolled ? 'text-white hover:bg-white/10 hover:text-white' : '';

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isHomePage && !scrolled
          ? 'bg-white/15 backdrop-blur-xl border-b border-white/20 shadow-lg'
          : 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <MapPin className={`h-6 w-6 ${isHomePage && !scrolled ? 'text-primary' : 'text-primary'}`} />
            <span className={`font-bold text-lg md:text-xl ${
              isHomePage && !scrolled ? 'text-white' : ''
            }`}>
              <span className={isHomePage && !scrolled ? 'text-white/90' : 'text-foreground'}>Sheher-e-</span>
              <span className="text-primary">Hyderabad</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={desktopLinkClass(link.path)}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <>
                {profile?.role === 'admin' && (
                  <Button variant="outline" className={authButtonClass} asChild>
                    <Link to="/admin">Admin</Link>
                  </Button>
                )}
                <Button variant="outline" className={authButtonClass} asChild>
                  <Link to="/planner">Plan Trip</Link>
                </Button>
                <Button variant="outline" className={authButtonClass} asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
                <Button variant="default" onClick={handleSignOut}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" className={authButtonClass} asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button variant="default" asChild>
                  <Link to="/register">Register</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className={mobileTriggerClass}>
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setOpen(false)}
                    className={`text-lg font-medium transition-colors hover:text-primary ${
                      isActive(link.path) ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-4 border-t space-y-2">
                  {user ? (
                    <>
                      {profile?.role === 'admin' && (
                        <Button variant="outline" className="w-full" asChild onClick={() => setOpen(false)}>
                          <Link to="/admin">Admin</Link>
                        </Button>
                      )}
                      <Button variant="outline" className="w-full" asChild onClick={() => setOpen(false)}>
                        <Link to="/planner">Plan Trip</Link>
                      </Button>
                      <Button variant="outline" className="w-full" asChild onClick={() => setOpen(false)}>
                        <Link to="/dashboard">Dashboard</Link>
                      </Button>
                      <Button variant="default" className="w-full" onClick={handleSignOut}>
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" className="w-full" asChild onClick={() => setOpen(false)}>
                        <Link to="/login">Login</Link>
                      </Button>
                      <Button variant="default" className="w-full" asChild onClick={() => setOpen(false)}>
                        <Link to="/register">Register</Link>
                      </Button>
                    </>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
