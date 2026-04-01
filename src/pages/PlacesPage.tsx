import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { getPlaces } from '@/db/api';
import type { Place } from '@/types';
import { Search } from 'lucide-react';
import ErrorState from '@/components/common/ErrorState';
import PremiumCard from '@/components/ui/premiumCard';

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
      <div className="container mx-auto px-4 py-10">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2">Places to Visit</h1>
          <p className="text-lg text-muted-foreground">
            Explore Hyderabad's iconic landmarks and attractions
          </p>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
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

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-xl bg-muted" />
            ))}
          </div>
        ) : error ? (
          <ErrorState title="Places are unavailable" description={error} />
        ) : filteredPlaces.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No places found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPlaces.map((place) => (
              <Link key={place.id} to={`/places/${place.id}`}>
                <PremiumCard
                  title={place.name}
                  image={place.image_url || 'https://source.unsplash.com/400x300/?hyderabad'}
                  rating={place.rating}
                  location={place.location}
                  tags={[place.category]}
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}