import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, DollarSign, MapPin, Tag } from 'lucide-react';
import MainLayout from '@/components/layouts/MainLayout';
import ErrorState from '@/components/common/ErrorState';
import { getPackageById } from '@/db/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { Package } from '@/types';

export default function PackageDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [pkg, setPkg] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError('We could not identify the selected package.');
      return;
    }

    getPackageById(id)
      .then((data) => {
        setPkg(data);
      })
      .catch(() => {
        setError('We could not load this package right now. Please try again shortly.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="mb-8 h-8 w-40 bg-muted" />
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <Skeleton className="aspect-video bg-muted" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4 bg-muted" />
              <Skeleton className="h-6 w-1/2 bg-muted" />
              <Skeleton className="h-24 w-full bg-muted" />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!pkg) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <ErrorState
            title={error ? 'Package unavailable' : 'Package not found'}
            description={error || 'We could not find the package you were looking for.'}
            actionLabel="Back to Packages"
            onAction={() => window.location.assign('/packages')}
          />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-8">
          <Link to="/packages">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Packages
          </Link>
        </Button>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="overflow-hidden rounded-lg bg-muted">
            {pkg.image_url ? (
              <img src={pkg.image_url} alt={pkg.name} className="aspect-video h-full w-full object-cover" />
            ) : (
              <div className="flex aspect-video items-center justify-center text-muted-foreground">
                Package preview unavailable
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <p className="mb-2 inline-flex items-center rounded-full bg-accent px-3 py-1 text-sm font-medium text-primary">
                <Tag className="mr-2 h-4 w-4" />
                {pkg.type === 'tourist' ? 'Tourist Package' : 'Local Package'}
              </p>
              <h1 className="mb-2 text-4xl font-bold">{pkg.name}</h1>
              {pkg.description && (
                <p className="text-lg text-muted-foreground">{pkg.description}</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="font-semibold">{pkg.duration}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Budget</p>
                      <p className="font-semibold">{pkg.budget}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <h2 className="font-semibold">Included Stops</h2>
                    <p className="text-sm text-muted-foreground">Everything already included in this predefined package</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {pkg.places.map((place) => (
                    <div key={place} className="rounded-lg border bg-accent/10 px-4 py-3 text-sm font-medium">
                      {place}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
