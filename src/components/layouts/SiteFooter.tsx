import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function SiteFooter() {
  const currentYear = new Date().getFullYear();

  const exploreLinks = [
    { path: '/food', label: 'Food & Drinks' },
    { path: '/places', label: 'Places to Visit' },
    { path: '/shopping', label: 'Shopping' },
    { path: '/entertainment', label: 'Entertainment' },
  ];

  const quickLinks = [
    { path: '/events', label: 'Events' },
    { path: '/culture', label: 'Culture' },
    { path: '/packages', label: 'Packages' },
    { path: '/contact', label: 'Contact Us' },
  ];

  return (
    <footer className="mt-auto border-t bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold gradient-text">Sheher-e-Hyderabad</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your smart companion for exploring Hyderabad. Discover food, places, events, and local culture with confidence.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <a href="mailto:info@hyderabadguide.com" className="transition-colors hover:text-primary">
                info@hyderabadguide.com
              </a>
              <a href="tel:+914012345678" className="block transition-colors hover:text-primary">
                +91 40 1234 5678
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Explore Hyderabad</h3>
            <ul className="space-y-2">
              {exploreLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <span>info@hyderabadguide.com</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                <span>+91 40 1234 5678</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} Sheher-e-Hyderabad. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
