import React, { useState, useEffect } from 'react';
import { HeroSection } from '@/components/HeroSection';
import { HotelCard } from '@/components/HotelCard';
import { BookingModal } from '@/components/BookingModal';
import { HotelService } from '@/services/hotelService';
import { Hotel, SearchParams, Booking } from '@/types/hotel';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Search } from 'lucide-react';

const Index = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const { toast } = useToast();

  // Handle search
  const handleSearch = async (params: SearchParams) => {
    setLoading(true);
    setSearchPerformed(true);
    
    try {
      const results = await HotelService.searchHotels(params);
      setHotels(results);
      
      if (results.length === 0) {
        toast({
          title: "No hotels found",
          description: "Try adjusting your search criteria or destination.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Search completed",
          description: `Found ${results.length} hotel${results.length !== 1 ? 's' : ''} for your stay.`,
          variant: "default",
        });
      }
    } catch (error) {
      toast({
        title: "Search failed",
        description: "There was an error searching for hotels. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle booking
  const handleBookNow = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setBookingModalOpen(true);
  };

  // Handle booking completion
  const handleBookingComplete = (booking: Booking) => {
    setRecentBookings(prev => [booking, ...prev.slice(0, 4)]); // Keep last 5 bookings
    toast({
      title: "Booking confirmed! 🎉",
      description: `Your reservation at ${selectedHotel?.name} has been confirmed.`,
      variant: "default",
    });
  };

  // Simulate real-time updates (in a real app, this would be WebSocket/SSE)
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate random booking updates
      if (hotels.length > 0 && Math.random() < 0.1) { // 10% chance every 5 seconds
        const randomHotel = hotels[Math.floor(Math.random() * hotels.length)];
        const mockBooking: Booking = {
          id: Date.now().toString(),
          hotelId: randomHotel.id,
          roomId: randomHotel.rooms[0].id,
          userId: 'anonymous-user',
          checkIn: new Date(),
          checkOut: new Date(Date.now() + 86400000), // Tomorrow
          guests: { adults: 2, children: 0 },
          totalPrice: randomHotel.pricePerNight,
          status: 'confirmed',
          createdAt: new Date(),
        };
        
        setRecentBookings(prev => [mockBooking, ...prev.slice(0, 4)]);
        
        // Show toast notification
        toast({
          title: "Live Update 🔴",
          description: `Someone just booked ${randomHotel.name}!`,
          variant: "default",
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [hotels, toast]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection onSearch={handleSearch} loading={loading} />

      {/* Results Section */}
      {searchPerformed && (
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                  <p className="text-lg font-medium text-foreground">Searching for hotels...</p>
                  <p className="text-muted-foreground">This may take a few moments</p>
                </div>
              </div>
            )}

            {/* Results Header */}
            {!loading && hotels.length > 0 && (
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  Available Hotels
                </h2>
                <p className="text-muted-foreground">
                  {hotels.length} hotel{hotels.length !== 1 ? 's' : ''} found for your search
                </p>
              </div>
            )}

            {/* No Results */}
            {!loading && searchPerformed && hotels.length === 0 && (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No hotels found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or choose a different destination.
                </p>
              </div>
            )}

            {/* Hotel Grid */}
            {!loading && hotels.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {hotels.map((hotel) => (
                  <HotelCard
                    key={hotel.id}
                    hotel={hotel}
                    onBookNow={handleBookNow}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Recent Bookings Section */}
      {recentBookings.length > 0 && (
        <section className="py-8 px-4 sm:px-6 lg:px-8 bg-secondary/30">
          <div className="max-w-7xl mx-auto">
            <h3 className="text-xl font-semibold text-foreground mb-4">
              🔴 Live Bookings
            </h3>
            <div className="space-y-2">
              {recentBookings.slice(0, 3).map((booking) => {
                const hotel = hotels.find(h => h.id === booking.hotelId);
                return (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between bg-white rounded-lg p-3 shadow-soft"
                  >
                    <div>
                      <p className="font-medium text-sm">
                        {hotel?.name || 'Hotel booking'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {booking.createdAt.toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-success">
                        ${booking.totalPrice}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {booking.guests.adults} guest{booking.guests.adults !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Booking Modal */}
      <BookingModal
        hotel={selectedHotel}
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        onBookingComplete={handleBookingComplete}
      />
    </div>
  );
};

export default Index;
