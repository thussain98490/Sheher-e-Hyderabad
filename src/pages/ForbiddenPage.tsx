import { Link } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import { Button } from '@/components/ui/button';

export default function ForbiddenPage() {
  return (
    <MainLayout>
      <div className="container mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center">
        <p className="mb-3 rounded-full bg-accent px-4 py-1 text-sm font-medium text-primary">
          Access Restricted
        </p>
        <h1 className="mb-4 text-4xl font-bold">You do not have permission to view this page.</h1>
        <p className="mb-8 text-lg text-muted-foreground">
          If you believe this is a mistake, sign in with an administrator account or return to the public site.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <Link to="/">Back to Home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
