import { MapPin, Star } from 'lucide-react';

interface PremiumCardProps {
  title: string;
  image: string;
  rating?: number;
  location?: string;
  tags?: string[];
}

export default function PremiumCard({
  title,
  image,
  rating,
  location,
  tags = [],
}: PremiumCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-card shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">

      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Rating */}
        {rating !== undefined && rating !== null && (
  <div className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-xs font-semibold">
    <Star className="h-3 w-3 text-yellow-500" />
    {rating}
  </div>
)}

      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold">{title}</h3>

        {location && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {location}
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2 pt-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}