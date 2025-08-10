import React, { useState } from 'react';
import { Search, MapPin, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { HotelService } from '@/services/hotelService';
import { SearchParams } from '@/types/hotel';

interface SearchBarProps {
  onSearch: (params: SearchParams) => void;
  loading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, loading }) => {
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [locationLoading, setLocationLoading] = useState(false);

  const handleSearch = () => {
    if (!destination || !checkIn || !checkOut) return;

    const searchParams: SearchParams = {
      destination,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      guests: { adults, children }
    };

    onSearch(searchParams);
  };

  const handleUseCurrentLocation = async () => {
    setLocationLoading(true);
    try {
      const coords = await HotelService.getCurrentLocation();
      const city = await HotelService.getCityFromCoordinates(coords.lat, coords.lng);
      setDestination(city);
    } catch (error) {
      console.error('Error getting location:', error);
      // You could show a toast here
    } finally {
      setLocationLoading(false);
    }
  };

  // Set default dates (today and tomorrow)
  React.useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    setCheckIn(today.toISOString().split('T')[0]);
    setCheckOut(tomorrow.toISOString().split('T')[0]);
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-large p-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
        {/* Destination */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-foreground mb-2">
            Where to?
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Enter city or destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleUseCurrentLocation}
            disabled={locationLoading}
            className="mt-1 text-xs text-primary hover:text-primary-hover"
          >
            <MapPin className="h-3 w-3 mr-1" />
            {locationLoading ? 'Getting location...' : 'Use current location'}
          </Button>
        </div>

        {/* Check-in */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Check-in
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
        </div>

        {/* Check-out */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Check-out
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
        </div>

        {/* Guests */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Guests
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <select
              value={`${adults}-${children}`}
              onChange={(e) => {
                const [a, c] = e.target.value.split('-').map(Number);
                setAdults(a);
                setChildren(c);
              }}
              className="w-full pl-10 h-12 border border-input rounded-md bg-background text-foreground"
            >
              <option value="1-0">1 Adult</option>
              <option value="2-0">2 Adults</option>
              <option value="2-1">2 Adults, 1 Child</option>
              <option value="2-2">2 Adults, 2 Children</option>
              <option value="3-0">3 Adults</option>
              <option value="4-0">4 Adults</option>
            </select>
          </div>
        </div>

        {/* Search Button */}
        <div>
          <Button
            onClick={handleSearch}
            disabled={loading || !destination || !checkIn || !checkOut}
            className={cn(buttonVariants({ variant: 'hero', size: 'lg' }), "w-full h-12")}
          >
            {loading ? 'Searching...' : 'Search Hotels'}
          </Button>
        </div>
      </div>
    </div>
  );
};