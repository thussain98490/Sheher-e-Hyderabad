import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getRouteForPath } from '@/routes';
import LoadingScreen from './LoadingScreen';
import { Button } from '@/components/ui/button';

interface RouteGuardProps {
  children: React.ReactNode;
}

export function RouteGuard({ children }: RouteGuardProps) {
  const { user, profile, loading, profileLoading, authError, retryAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const route = getRouteForPath(location.pathname);
  const routeAccess = route?.access ?? 'public';
  const shouldBlockForLoading = loading && !authError;
  const shouldBlockForAdminProfile = routeAccess === 'admin' && !!user && profileLoading && !profile;

  useEffect(() => {
    if (shouldBlockForLoading || shouldBlockForAdminProfile) return;

    if (!route) {
      return;
    }

    if (route.access !== 'public' && !user) {
      navigate('/login', { state: { from: location.pathname }, replace: true });
      return;
    }

    if (route.access === 'admin' && user && profile?.role !== 'admin') {
      navigate('/403', { replace: true });
    }
  }, [user, profile?.role, route, shouldBlockForLoading, shouldBlockForAdminProfile, location.pathname, navigate]);

  if (shouldBlockForLoading || shouldBlockForAdminProfile) {
    return <LoadingScreen label="Checking access..." />;
  }

  if (authError && routeAccess === 'admin' && !profile) {
    return <LoadingScreen label="Redirecting to a safe page..." />;
  }

  return (
    <>
      {authError && routeAccess === 'public' && (
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-amber-900">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold">Authentication is temporarily unavailable.</p>
              <p className="text-sm text-amber-800/90">{authError}</p>
            </div>
            <Button variant="outline" onClick={() => void retryAuth()}>
              Retry Access Check
            </Button>
          </div>
        </div>
      )}
      {children}
    </>
  );
}
