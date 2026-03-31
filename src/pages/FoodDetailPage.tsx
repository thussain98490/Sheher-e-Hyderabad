import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getFoodItemById } from '@/db/api';
import type { FoodItem } from '@/types';
import { ArrowLeft, MapPin, Star } from 'lucide-react';
import ErrorState from '@/components/common/ErrorState';

export default function FoodDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<FoodItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      getFoodItemById(id)
        .then((data) => {
          setItem(data);
        })
        .catch(() => {
          setError('We could not load this food listing right now. Please try again shortly.');
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
            title={error ? 'Food listing unavailable' : 'Food item not found'}
            description={error || 'We could not find the food listing you were looking for.'}
            actionLabel="Back to Food"
            onAction={() => window.location.assign('/food')}
          />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-8">
          <Link to="/food">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Food
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
                  <h2 className="text-xl font-semibold mb-2">Description</h2>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-2 gap-4">
              {item.price && (
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm text-muted-foreground mb-1">Price Range</p>
                    <p className="text-2xl font-bold text-primary">{item.price}</p>
                  </CardContent>
                </Card>
              )}
              {item.rating && (
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm text-muted-foreground mb-1">Rating</p>
                    <p className="text-2xl font-bold flex items-center">
                      <Star className="h-6 w-6 text-primary mr-1 fill-primary" />
                      {item.rating}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {item.location && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Location</h3>
                      <p className="text-muted-foreground">{item.location}</p>
                    </div>
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
