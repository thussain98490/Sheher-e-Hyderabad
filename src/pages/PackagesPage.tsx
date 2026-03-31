import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { getPackages } from '@/db/api';
import type { Package } from '@/types';
import { Clock, DollarSign, MapPin } from 'lucide-react';
import ErrorState from '@/components/common/ErrorState';

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'tourist' | 'local'>('tourist');

  useEffect(() => {
    getPackages()
      .then((data) => {
        setPackages(data);
      })
      .catch(() => {
        setError('We could not load packages right now. Please try again shortly.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const touristPackages = packages.filter((pkg) => pkg.type === 'tourist');
  const localPackages = packages.filter((pkg) => pkg.type === 'local');

  const PackageCard = ({ pkg }: { pkg: Package }) => (
    <Card className="hover:shadow-lg transition-all hover:scale-105">
      <div className="aspect-video bg-muted relative overflow-hidden">
        {pkg.image_url && (
          <img
            src={pkg.image_url}
            alt={pkg.name}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <CardHeader>
        <CardTitle>{pkg.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {pkg.description && (
          <p className="text-sm text-muted-foreground">{pkg.description}</p>
        )}
        
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 text-primary mr-2" />
            <span className="font-medium">{pkg.duration}</span>
          </div>
          <div className="flex items-center text-sm">
            <DollarSign className="h-4 w-4 text-primary mr-2" />
            <span className="font-medium">{pkg.budget}</span>
          </div>
          <div className="flex items-start text-sm">
            <MapPin className="h-4 w-4 text-primary mr-2 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium mb-1">Includes:</p>
              <div className="flex flex-wrap gap-1">
                {pkg.places.slice(0, 3).map((place: string, index: number) => (
                  <span key={index} className="text-xs bg-accent px-2 py-1 rounded">
                    {place}
                  </span>
                ))}
                {pkg.places.length > 3 && (
                  <span className="text-xs bg-accent px-2 py-1 rounded">
                    +{pkg.places.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <Button className="w-full" asChild>
          <Link to={`/packages/${pkg.id}`}>View Package</Link>
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Travel Packages</h1>
          <p className="text-lg text-muted-foreground">
            Curated packages for tourists and locals
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'tourist' | 'local')}>
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="tourist">Tourist Packages</TabsTrigger>
            <TabsTrigger value="local">Local Packages</TabsTrigger>
          </TabsList>

          <TabsContent value="tourist">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <Card key={i}>
                    <Skeleton className="aspect-video bg-muted" />
                    <CardContent className="p-6">
                      <Skeleton className="h-6 w-3/4 mb-2 bg-muted" />
                      <Skeleton className="h-4 w-full mb-4 bg-muted" />
                      <Skeleton className="h-10 w-full bg-muted" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : error ? (
              <ErrorState title="Packages are unavailable" description={error} />
            ) : touristPackages.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">No tourist packages available</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {touristPackages.map((pkg) => (
                  <PackageCard key={pkg.id} pkg={pkg} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="local">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <Card key={i}>
                    <Skeleton className="aspect-video bg-muted" />
                    <CardContent className="p-6">
                      <Skeleton className="h-6 w-3/4 mb-2 bg-muted" />
                      <Skeleton className="h-4 w-full mb-4 bg-muted" />
                      <Skeleton className="h-10 w-full bg-muted" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : error ? (
              <ErrorState title="Packages are unavailable" description={error} />
            ) : localPackages.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">No local packages available</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {localPackages.map((pkg) => (
                  <PackageCard key={pkg.id} pkg={pkg} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
