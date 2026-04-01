import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { getEvents } from '@/db/api';
import type { Event } from '@/types';
import { Search } from 'lucide-react';
import { format } from 'date-fns';
import ErrorState from '@/components/common/ErrorState';
import PremiumCard from '@/components/ui/premiumCard';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['All', 'Cultural', 'Religious', 'Food', 'Shopping'];

  useEffect(() => {
    getEvents()
      .then((data) => {
        setEvents(data);
        setFilteredEvents(data);
      })
      .catch(() => {
        setError('We could not load events right now. Please try again shortly.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = events;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((event) => event.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
  }, [searchTerm, selectedCategory, events]);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-10">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2">Events</h1>
          <p className="text-lg text-muted-foreground">
            Upcoming festivals and experiences in Hyderabad
          </p>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search events..."
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
          <ErrorState title="Events are unavailable" description={error} />
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No events found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <Link key={event.id} to={`/events/${event.id}`}>
                <PremiumCard
                  title={event.name}
                  image={event.image_url || 'https://source.unsplash.com/400x300/?festival'}
                  rating={undefined} // NO rating
                  location={format(new Date(event.date), 'MMM dd, yyyy')}
                  tags={event.category ? [event.category] : []}
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}