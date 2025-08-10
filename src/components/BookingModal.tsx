import React, { useState, useEffect } from 'react';
import { X, Calendar, Users, CreditCard } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Hotel, Room, Booking } from '@/types/hotel';

interface BookingModalProps {
  hotel: Hotel | null;
  isOpen: boolean;
  onClose: () => void;
  onBookingComplete: (booking: Booking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  hotel,
  isOpen,
  onClose,
  onBookingComplete,
}) => {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [guestInfo, setGuestInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);

  // Calculate total nights and price
  const calculateTotal = () => {
    if (!selectedRoom || !checkIn || !checkOut) return 0;
    
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    
    return nights * selectedRoom.pricePerNight;
  };

  const nights = checkIn && checkOut ? 
    Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)) : 0;

  // Set default dates when modal opens
  useEffect(() => {
    if (isOpen) {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      setCheckIn(today.toISOString().split('T')[0]);
      setCheckOut(tomorrow.toISOString().split('T')[0]);
      setSelectedRoom(hotel?.rooms[0] || null);
    }
  }, [isOpen, hotel]);

  const handleBooking = async () => {
    if (!hotel || !selectedRoom || !checkIn || !checkOut) return;

    setLoading(true);
    
    // Simulate booking API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    const booking: Booking = {
      id: Date.now().toString(),
      hotelId: hotel.id,
      roomId: selectedRoom.id,
      userId: 'current-user',
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      guests: { adults, children },
      totalPrice: calculateTotal(),
      status: 'confirmed',
      createdAt: new Date(),
    };

    onBookingComplete(booking);
    setLoading(false);
    onClose();
  };

  const isFormValid = selectedRoom && checkIn && checkOut && 
    guestInfo.firstName && guestInfo.lastName && guestInfo.email;

  if (!hotel) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b border-border pb-4">
          <DialogTitle className="text-2xl font-bold text-foreground">
            Complete Your Booking
          </DialogTitle>
          <p className="text-muted-foreground">
            {hotel.name} • {hotel.location.city}, {hotel.location.country}
          </p>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-6">
          {/* Left Column - Booking Details */}
          <div className="space-y-6">
            {/* Room Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-primary" />
                Select Room
              </h3>
              <div className="space-y-3">
                {hotel.rooms.map((room) => (
                  <div
                    key={room.id}
                    className={cn(
                      "p-4 border rounded-lg cursor-pointer transition-all",
                      selectedRoom?.id === room.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                    onClick={() => setSelectedRoom(room)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-foreground">{room.type}</h4>
                        <p className="text-sm text-muted-foreground">
                          Max {room.maxGuests} guests
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {room.amenities.map((amenity, index) => (
                            <span
                              key={index}
                              className="text-xs bg-secondary rounded-full px-2 py-1"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-foreground">
                          ${room.pricePerNight}
                        </p>
                        <p className="text-xs text-muted-foreground">per night</p>
                        <p className="text-xs text-success">
                          {room.availableRooms} rooms left
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dates & Guests */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-primary" />
                Dates & Guests
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Check-in</label>
                  <Input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Check-out</label>
                  <Input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Adults</label>
                  <select
                    value={adults}
                    onChange={(e) => setAdults(Number(e.target.value))}
                    className="w-full p-2 border border-input rounded-md"
                  >
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Children</label>
                  <select
                    value={children}
                    onChange={(e) => setChildren(Number(e.target.value))}
                    className="w-full p-2 border border-input rounded-md"
                  >
                    {[0, 1, 2, 3, 4].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Guest Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2 text-primary" />
                Guest Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">First Name</label>
                  <Input
                    value={guestInfo.firstName}
                    onChange={(e) => setGuestInfo({...guestInfo, firstName: e.target.value})}
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Last Name</label>
                  <Input
                    value={guestInfo.lastName}
                    onChange={(e) => setGuestInfo({...guestInfo, lastName: e.target.value})}
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input
                    type="email"
                    value={guestInfo.email}
                    onChange={(e) => setGuestInfo({...guestInfo, email: e.target.value})}
                    placeholder="john.doe@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone (Optional)</label>
                  <Input
                    type="tel"
                    value={guestInfo.phone}
                    onChange={(e) => setGuestInfo({...guestInfo, phone: e.target.value})}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Summary */}
          <div className="lg:border-l lg:border-border lg:pl-8">
            <div className="bg-card-gradient rounded-xl p-6 sticky top-6">
              <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hotel</span>
                  <span className="font-medium">{hotel.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Room</span>
                  <span className="font-medium">
                    {selectedRoom?.type || 'Select room'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dates</span>
                  <span className="font-medium">
                    {checkIn && checkOut ? `${nights} night${nights !== 1 ? 's' : ''}` : 'Select dates'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Guests</span>
                  <span className="font-medium">
                    {adults} adult{adults !== 1 ? 's' : ''}
                    {children > 0 && `, ${children} child${children !== 1 ? 'ren' : ''}`}
                  </span>
                </div>
                
                <div className="border-t border-border pt-3 mt-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      ${selectedRoom?.pricePerNight || 0} × {nights} night{nights !== 1 ? 's' : ''}
                    </span>
                    <span className="font-medium">
                      ${selectedRoom ? selectedRoom.pricePerNight * nights : 0}
                    </span>
                  </div>
                </div>
                
                <div className="border-t border-border pt-3 mt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">${calculateTotal()}</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleBooking}
                disabled={!isFormValid || loading}
                className={cn(buttonVariants({ variant: 'hero', size: 'lg' }), "w-full mt-6")}
              >
                {loading ? 'Processing...' : `Book Now - $${calculateTotal()}`}
              </Button>

              <p className="text-xs text-muted-foreground mt-3 text-center">
                Free cancellation within 24 hours
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};