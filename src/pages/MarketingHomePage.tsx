import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Calendar,
  Heart,
  MapPin,
  Music,
  ShoppingBag,
  Sparkles,
  Star,
  Utensils,
} from 'lucide-react';
import { getPlaces } from '@/db/api';
import ErrorState from '@/components/common/ErrorState';
import Header from '@/components/layouts/Header';
import SiteFooter from '@/components/layouts/SiteFooter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Place } from '@/types';

export default function MarketingHomePage() {
  const [featuredPlaces, setFeaturedPlaces] = useState<Place[]>([]);
  const [scrollY, setScrollY] = useState(0);
  const [featuredError, setFeaturedError] = useState<string | null>(null);

  useEffect(() => {
    getPlaces()
      .then((places) => {
        setFeaturedPlaces(places.slice(0, 3));
      })
      .catch(() => {
        setFeaturedError('Featured places are temporarily unavailable.');
      });

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = [
    { icon: Utensils, title: 'Food & Drinks', description: 'Explore legendary biryani and street food', path: '/food', color: 'text-primary' },
    { icon: MapPin, title: 'Places to Visit', description: 'Historical monuments and attractions', path: '/places', color: 'text-secondary' },
    { icon: ShoppingBag, title: 'Shopping', description: 'Markets, malls, and handicrafts', path: '/shopping', color: 'text-primary' },
    { icon: Music, title: 'Entertainment', description: 'Movies, gaming, and nightlife', path: '/entertainment', color: 'text-secondary' },
    { icon: Sparkles, title: 'Culture', description: 'Traditions, festivals, and lifestyle', path: '/culture', color: 'text-primary' },
    { icon: Calendar, title: 'Events', description: 'Upcoming festivals and exhibitions', path: '/events', color: 'text-secondary' },
    { icon: Heart, title: 'Packages', description: 'Curated travel packages', path: '/packages', color: 'text-primary' },
  ];

  const slangPhrases = [
    'Hau – Say yes like a Hyderabadi ',
    'Nakko – The classic way to say no ',
    'Baigan – When something makes no sense ',
    'Kya scene hai – What’s up? ',
    'Bindaas – Stay carefree ',
    'Mast – When it’s really good ',
    'Ek dum – Absolutely! ',
  ];

  return (
    <>
      {/* HERO (UNCHANGED) */}
      <section
        className="relative flex min-h-screen items-center justify-center overflow-hidden"
        style={{
          backgroundImage: 'url(https://gjazqutwqfxlabihdoqn.supabase.co/storage/v1/object/public/home%20page/d7705a80-5aa2-4297-b63b-b82d4a7391bf.png)',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
        <div className="absolute left-0 right-0 top-0 z-50">
          <Header />
        </div>

        <div
          className="container relative z-10 mx-auto px-4 text-center"
          style={{
            transform: `translateY(${scrollY * 0.3}px)`,
            transition: 'transform 0.1s ease-out',
          }}
        >
          <div className="animate-fade-in">
            <h1 className="mb-6 text-5xl font-bold text-white drop-shadow-2xl md:text-7xl">
              Welcome to <span className="text-primary drop-shadow-lg">Hyderabad</span>
            </h1>
            <p className="mb-3 text-xl text-white/90 drop-shadow-lg md:text-3xl">
              Your Smart City Guide & Travel Planner
            </p>
            <p className="mb-10 text-3xl font-semibold text-primary drop-shadow-lg animate-pulse-slow md:text-4xl">
              Discover the City Like Never Before!
            </p>
            <div className="flex flex-col justify-center gap-4 animate-slide-up sm:flex-row">
              <Button size="lg" className="px-8 py-6 text-lg shadow-2xl transition-transform hover:scale-105" asChild>
                <Link to="/planner">
                  Plan Your Trip <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 bg-white/10 px-8 py-6 text-lg text-white shadow-2xl backdrop-blur-md transition-transform hover:scale-105 hover:bg-white/20"
                asChild
              >
                <Link to="/places">Explore Places</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-white/50 p-2">
            <div className="h-3 w-1 rounded-full bg-white/70 animate-scroll-down" />
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="overflow-hidden bg-primary py-4 text-primary-foreground group">
        <div
          className="flex whitespace-nowrap animate-marquee group-hover:[animation-play-state:paused]"
          style={{ animationDuration: '12s' }}
        >
          {[...slangPhrases, ...slangPhrases].map((phrase, index) => (
            <span key={index} className="mx-10 text-base font-medium tracking-wide">
              {phrase}
            </span>
          ))}
        </div>
      </section>

      {/* CULTURE */}
      <section className="bg-accent/10 py-20">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold tracking-tight md:text-4xl">
              Ganga-Jamuni Tehzeeb
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Experience the unique blend of Hindu and Muslim cultures that defines Hyderabad's rich heritage.
              From the majestic Charminar to the aromatic biryani, discover a city where traditions harmoniously coexist.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                title: 'Languages',
                description: 'Telugu, Urdu, Hindi, and the unique Hyderabadi dialect blend seamlessly in daily conversations.',
              },
              {
                title: 'Landmarks',
                description: 'From Golconda Fort to Birla Mandir, witness architectural marvels spanning centuries.',
              },
              {
                title: 'Cuisine',
                description: "World-famous Hyderabadi biryani, haleem, and Irani chai represent the city's culinary heritage.",
              },
            ].map((item) => (
              <Card key={item.title} className="transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <CardContent className="p-6">
                  <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-20">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold tracking-tight md:text-4xl">
              Explore Hyderabad
            </h2>
            <p className="text-lg text-muted-foreground">
              From iconic landmarks to hidden gems — plan, explore, and experience Hyderabad effortlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link key={category.path} to={category.path}>
                  <Card className="h-full cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:shadow-xl">
                    <CardContent className="flex flex-col items-center space-y-4 p-6 text-center">
                      <div className={`rounded-full bg-accent p-4 ${category.color}`}>
                        <Icon className="h-8 w-8" />
                      </div>
                      <h3 className="text-xl font-semibold">{category.title}</h3>
                      <p className="text-muted-foreground">{category.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      {featuredError ? (
        <section className="bg-accent/10 py-20">
          <div className="container mx-auto max-w-7xl px-4">
            <ErrorState title="Featured places are unavailable" description={featuredError} />
          </div>
        </section>
      ) : featuredPlaces.length > 0 ? (
        <section className="bg-accent/10 py-20">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-4xl font-bold tracking-tight md:text-4xl">
                Featured Places
              </h2>
              <p className="text-lg text-muted-foreground">
                Must-visit attractions in Hyderabad
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {featuredPlaces.map((place) => (
                <Link key={place.id} to={`/places/${place.id}`}>
                  <Card className="h-full cursor-pointer overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-xl group">
                    <div className="relative aspect-video overflow-hidden bg-muted">
                      {place.image_url && (
                        <img
                          src={place.image_url}
                          alt={place.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                    </div>

                    <CardContent className="p-6">
                      <h3 className="mb-2 text-xl font-semibold">{place.name}</h3>
                      <p className="mb-2 text-sm text-muted-foreground">{place.category}</p>
                      <p className="line-clamp-2 text-sm text-muted-foreground">{place.description}</p>

                      {place.rating && (
                        <div className="mt-4 flex items-center gap-1 text-primary">
                          <Star className="h-4 w-4 fill-primary" />
                          <span className="font-semibold">{place.rating}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Button size="lg" asChild>
                <Link to="/places">
                  View All Places <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      ) : null}

      <SiteFooter />
    </>
  );
}