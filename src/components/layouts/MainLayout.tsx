import { ReactNode } from 'react';
import Header from './Header';
import SiteFooter from './SiteFooter';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
