import React from 'react';
import { Star, MapPin, Wifi, Car, Coffee, Dumbbell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Hotel } from '@/types/hotel';
import hotelRoom1 from '@/assets/hotel-room-1.jpg';
import hotelRoom2 from '@/assets/hotel-room-2.jpg';
import hotelRoom3 from '@/assets/hotel-room-3.jpg';

interface HotelCardProps {
  hotel: Hotel;
  onBookNow: (hotel: Hotel) => void;
}

const amenityIcons: Record<string, React.ReactNode> = {
  'WiFi': <Wifi className="h-4 w-4" />,
  'Pool': <div className="h-4 w-4 text-primary">🏊</div>,
  'Spa': <div className="h-4 w-4 text-primary">🧖</div>,
  'Restaurant': <Coffee className="h-4 w-4" />,
  'Gym': <Dumbbell className="h-4 w-4" />,
  'Parking': <Car className="h-4 w-4" />,
  'Beach Access': <div className="h-4 w-4 text-primary">🏖️</div>,
  'Business Center': <div className="h-4 w-4 text-primary">💼</div>,
  'Ski Access': <div className="h-4 w-4 text-primary">⛷️</div>,
  'Fireplace': <div className="h-4 w-4 text-primary">🔥</div>,
};

// Map hotel IDs to images
const hotelImages: Record<string, string> = {
  '1': hotelRoom1,
  '2': hotelRoom2,
  '3': hotelRoom3,
};

export const HotelCard: React.FC<HotelCardProps> = ({ hotel, onBookNow }) => {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="h-4 w-4 fill-warning text-warning" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="h-4 w-4 fill-warning/50 text-warning" />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="h-4 w-4 text-muted-foreground" />
      );
    }

    return stars;
  };

  return (
    <div className="bg-white rounded-xl shadow-medium hover:shadow-large transition-all duration-300 overflow-hidden group">
      {/* Hotel Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={hotelImages[hotel.id] || hotelRoom1}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
          <span className="text-sm font-semibold text-foreground">
            ${hotel.pricePerNight}
            <span className="text-xs text-muted-foreground">/night</span>
          </span>
        </div>
      </div>

      {/* Hotel Info */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-1 line-clamp-1">
              {hotel.name}
            </h3>
            <div className="flex items-center text-muted-foreground text-sm">
              <MapPin className="h-4 w-4 mr-1" />
              {hotel.location.city}, {hotel.location.country}
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1">
            {renderStars(hotel.rating)}
          </div>
          <span className="text-sm font-medium text-foreground">
            {hotel.rating}
          </span>
          <span className="text-sm text-muted-foreground">
            ({hotel.reviewCount} reviews)
          </span>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mb-4">
          {hotel.amenities.slice(0, 4).map((amenity, index) => (
            <div
              key={index}
              className="flex items-center gap-1 bg-secondary/50 rounded-full px-3 py-1 text-xs"
            >
              {amenityIcons[amenity] || <div className="h-4 w-4">•</div>}
              <span className="text-secondary-foreground">{amenity}</span>
            </div>
          ))}
          {hotel.amenities.length > 4 && (
            <div className="flex items-center bg-secondary/50 rounded-full px-3 py-1 text-xs">
              <span className="text-secondary-foreground">
                +{hotel.amenities.length - 4} more
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {hotel.description}
        </p>

        {/* Book Now Button */}
        <Button
          onClick={() => onBookNow(hotel)}
          className={cn(buttonVariants({ variant: 'accent', size: 'lg' }), "w-full")}
        >
          Book Now
        </Button>
      </div>
    </div>
  );
};