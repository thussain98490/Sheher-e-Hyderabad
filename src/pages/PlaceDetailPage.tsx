import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getPlaceById } from '@/db/api';
import type { Place } from '@/types';
import { ArrowLeft, MapPin, Star, Clock, DollarSign, Calendar } from 'lucide-react';
import ErrorState from '@/components/common/ErrorState';

export default function PlaceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      getPlaceById(id)
        .then(setPlace)
        .catch(() =>
          setError('We could not load this place right now. Please try again shortly.')
        )
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-32 mb-8 bg-muted" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="aspect-video bg-muted rounded-xl" />
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

  if (!place) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <ErrorState
            title={error ? 'Place unavailable' : 'Place not found'}
            description={error || 'We could not find the place you were looking for.'}
            actionLabel="Back to Places"
            onAction={() => navigate('/places')}
          />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-10">
        <Button variant="ghost" asChild className="mb-8">
          <Link to="/places">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Places
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Image */}
          <div className="aspect-video bg-muted rounded-xl overflow-hidden shadow-md">
            {place.image_url && (
              <img
                src={place.image_url}
                alt={place.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Content */}
          <div className="space-y-6 max-w-xl">
            <div>
              <h1 className="text-4xl font-bold mb-2">{place.name}</h1>
              <p className="text-xl text-primary font-medium">{place.category}</p>
            </div>

            {place.description && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-2">About</h2>
                  <p className="text-muted-foreground">{place.description}</p>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {place.timings && (
                <Card>
                  <CardContent className="p-6 flex items-start gap-2">
                    <Clock className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="text-sm text-muted-foreground">Timings</p>
                      <p className="font-semibold">{place.timings}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {place.entry_fee && (
                <Card>
                  <CardContent className="p-6 flex items-start gap-2">
                    <DollarSign className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="text-sm text-muted-foreground">Entry Fee</p>
                      <p className="font-semibold">{place.entry_fee}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {place.best_time && (
                <Card>
                  <CardContent className="p-6 flex items-start gap-2">
                    <Calendar className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="text-sm text-muted-foreground">Best Time</p>
                      <p className="font-semibold">{place.best_time}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {place.rating && (
                <Card>
                  <CardContent className="p-6 flex items-start gap-2">
                    <Star className="h-5 w-5 text-primary mt-1 fill-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Rating</p>
                      <p className="font-semibold">{place.rating} / 5.0</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {place.location && (
              <Card>
                <CardContent className="p-6 flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Location</h3>
                    <p className="text-muted-foreground">{place.location}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}