import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { getFoodItems } from '@/db/api';
import type { FoodItem } from '@/types';
import { Search } from 'lucide-react';
import ErrorState from '@/components/common/ErrorState';
import PremiumCard from '@/components/ui/premiumCard';

export default function FoodPage() {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['All', 'Street Food', 'Restaurants', 'Cafes', 'Biryani', 'Desserts'];

  useEffect(() => {
    getFoodItems()
      .then((data) => {
        setItems(data);
        setFilteredItems(data);
      })
      .catch(() => {
        setError('We could not load food recommendations right now. Please try again shortly.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = items;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  }, [searchTerm, selectedCategory, items]);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-10">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2">Food & Drinks</h1>
          <p className="text-lg text-muted-foreground">
            Discover Hyderabad's legendary culinary scene
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search food items..."
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

        {/* Items */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-xl bg-muted" />
            ))}
          </div>
        ) : error ? (
          <ErrorState title="Food listings are unavailable" description={error} />
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No food items found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <Link key={item.id} to={`/food/${item.id}`}>
                <PremiumCard
                  title={item.name}
                  image={item.image_url || '/placeholder-food.jpg'}
                  rating={item.rating}
                  location={item.location}
                  tags={[item.category]}
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}