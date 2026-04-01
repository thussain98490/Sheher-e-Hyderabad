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
    `relative text-sm font-medium transition-all duration-300 ${
      isHomePage && !scrolled
        ? isActive(path)
          ? 'text-primary font-semibold'
          : 'text-white/80 hover:text-white'
        : isActive(path)
        ? 'text-primary font-semibold'
        : 'text-muted-foreground hover:text-primary'
    } 
    after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full`;

  const authButtonClass =
    isHomePage && !scrolled
      ? 'border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white transition-all duration-300 hover:scale-105'
      : 'transition-all duration-300 hover:scale-105';

  const mobileTriggerClass =
    isHomePage && !scrolled
      ? 'text-white hover:bg-white/10 hover:text-white'
      : '';

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isHomePage && !scrolled
          ? 'bg-white/10 backdrop-blur-2xl border-b border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.12)]'
          : 'bg-white/80 backdrop-blur-xl border-b shadow-sm'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between px-2">

          {/* LOGO */}
          <Link
            to="/"
            className="flex items-center space-x-2 transition-transform duration-300 hover:scale-105"
          >
            <MapPin className="h-6 w-6 text-primary drop-shadow-sm" />
            <span
              className={`font-bold text-lg md:text-xl ${
                isHomePage && !scrolled ? 'text-white' : ''
              }`}
            >
              <span
                className={
                  isHomePage && !scrolled
                    ? 'text-white/90'
                    : 'text-foreground'
                }
              >
                Sheher-e-
              </span>
              <span className="text-primary">Hyderabad</span>
            </span>
          </Link>

          {/* DESKTOP NAV */}
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

          {/* DESKTOP BUTTONS */}
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

                <Button
                  variant="default"
                  onClick={handleSignOut}
                  className="transition-all duration-300 hover:scale-105"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" className={authButtonClass} asChild>
                  <Link to="/login">Login</Link>
                </Button>

                <Button
                  variant="default"
                  asChild
                  className="transition-all duration-300 hover:scale-105"
                >
                  <Link to="/register">Register</Link>
                </Button>
              </>
            )}
          </div>

          {/* MOBILE MENU */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                className={mobileTriggerClass}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[300px] sm:w-[400px] bg-white/90 backdrop-blur-xl"
            >
              <nav className="flex flex-col space-y-4 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setOpen(false)}
                    className={`text-lg font-medium transition-colors hover:text-primary ${
                      isActive(link.path)
                        ? 'text-primary font-semibold'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="pt-4 border-t space-y-2">
                  {user ? (
                    <>
                      {profile?.role === 'admin' && (
                        <Button
                          variant="outline"
                          className="w-full"
                          asChild
                          onClick={() => setOpen(false)}
                        >
                          <Link to="/admin">Admin</Link>
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        className="w-full"
                        asChild
                        onClick={() => setOpen(false)}
                      >
                        <Link to="/planner">Plan Trip</Link>
                      </Button>

                      <Button
                        variant="outline"
                        className="w-full"
                        asChild
                        onClick={() => setOpen(false)}
                      >
                        <Link to="/dashboard">Dashboard</Link>
                      </Button>

                      <Button
                        variant="default"
                        className="w-full"
                        onClick={handleSignOut}
                      >
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        className="w-full"
                        asChild
                        onClick={() => setOpen(false)}
                      >
                        <Link to="/login">Login</Link>
                      </Button>

                      <Button
                        variant="default"
                        className="w-full"
                        asChild
                        onClick={() => setOpen(false)}
                      >
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