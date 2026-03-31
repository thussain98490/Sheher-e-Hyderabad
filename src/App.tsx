import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import IntersectObserver from '@/components/common/IntersectObserver';
import { Toaster } from '@/components/ui/sonner';
import PageMeta from '@/components/common/PageMeta';
import LoadingScreen from '@/components/common/LoadingScreen';

import routes from './routes';

import { AuthProvider } from '@/contexts/AuthContext';
import { RouteGuard } from '@/components/common/RouteGuard';
const NotFound = React.lazy(() => import('@/pages/NotFound'));

function RoutedPage({
  Component,
  title,
  description,
}: {
  Component: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <>
      <PageMeta title={title} description={description} />
      <Suspense fallback={<LoadingScreen />}>
        <Component />
      </Suspense>
    </>
  );
}

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <RouteGuard>
          <IntersectObserver />
          <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
              <Routes>
                {routes.map((route, index) => (
                  <Route
                    key={index}
                    path={route.path}
                    element={
                      <RoutedPage
                        Component={route.Component}
                        title={route.title}
                        description={route.description}
                      />
                    }
                  />
                ))}
                <Route
                  path="*"
                  element={
                    <RoutedPage
                      Component={NotFound}
                      title="Page Not Found"
                      description="The page you are looking for could not be found."
                    />
                  }
                />
              </Routes>
            </main>
          </div>
          <Toaster />
        </RouteGuard>
      </AuthProvider>
    </Router>
  );
};

export default App;
