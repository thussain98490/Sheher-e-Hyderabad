import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { getPlaces } from '@/db/api';
import type { Place } from '@/types';
import { Search } from 'lucide-react';
import ErrorState from '@/components/common/ErrorState';

export default function PlacesPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['All', 'Historical', 'Religious', 'Parks', 'Museums', 'Getaways'];

  useEffect(() => {
    getPlaces()
      .then((data) => {
        setPlaces(data);
        setFilteredPlaces(data);
      })
      .catch(() => {
        setError('We could not load places right now. Please try again shortly.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = places;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((place) => place.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (place) =>
          place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          place.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPlaces(filtered);
  }, [searchTerm, selectedCategory, places]);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Places to Visit</h1>
          <p className="text-lg text-muted-foreground">
            Explore Hyderabad's iconic landmarks and attractions
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search places..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat === 'All' ? 'all' : cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <Skeleton className="aspect-video bg-muted" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2 bg-muted" />
                  <Skeleton className="h-4 w-1/2 mb-4 bg-muted" />
                  <Skeleton className="h-4 w-full bg-muted" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <ErrorState title="Places are unavailable" description={error} />
        ) : filteredPlaces.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No places found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlaces.map((place) => (
              <Link key={place.id} to={`/places/${place.id}`}>
                <Card className="h-full hover:shadow-lg transition-all hover:scale-105 cursor-pointer overflow-hidden">
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    {place.image_url && (
                      <img
                        src={place.image_url}
                        alt={place.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{place.name}</h3>
                    <p className="text-sm text-primary font-medium mb-2">{place.category}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {place.description}
                    </p>
                    <div className="flex items-center justify-between">
                      {place.entry_fee && (
                        <span className="text-sm font-medium">{place.entry_fee}</span>
                      )}
                      {place.rating && (
                        <span className="text-sm font-medium">⭐ {place.rating}</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
