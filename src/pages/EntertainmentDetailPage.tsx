import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getEntertainmentById } from '@/db/api';
import type { Entertainment } from '@/types';
import { ArrowLeft, MapPin, Clock, DollarSign } from 'lucide-react';
import ErrorState from '@/components/common/ErrorState';

export default function EntertainmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Entertainment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      getEntertainmentById(id)
        .then((data) => {
          setItem(data);
        })
        .catch(() => {
          setError('We could not load this entertainment listing right now. Please try again shortly.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-32 mb-8 bg-muted" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

  if (!item) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <ErrorState
            title={error ? 'Entertainment listing unavailable' : 'Entertainment option not found'}
            description={error || 'We could not find the entertainment option you were looking for.'}
            actionLabel="Back to Entertainment"
            onAction={() => window.location.assign('/entertainment')}
          />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-8">
          <Link to="/entertainment">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Entertainment
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="aspect-video bg-muted rounded-lg overflow-hidden">
            {item.image_url && (
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{item.name}</h1>
              <p className="text-xl text-primary font-medium">{item.category}</p>
            </div>

            {item.description && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-2">About</h2>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
              {item.timings && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-2">
                      <Clock className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Timings</p>
                        <p className="font-semibold">{item.timings}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              {item.price && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-2">
                      <DollarSign className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Price Range</p>
                        <p className="font-semibold">{item.price}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              {item.location && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Location</p>
                        <p className="font-semibold">{item.location}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
