export interface Hotel {
  id: string;
  name: string;
  location: {
    city: string;
    country: string;
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  rating: number;
  reviewCount: number;
  images: string[];
  pricePerNight: number;
  currency: string;
  amenities: string[];
  description: string;
  rooms: Room[];
}

export interface Room {
  id: string;
  type: string;
  maxGuests: number;
  pricePerNight: number;
  amenities: string[];
  images: string[];
  availableRooms: number;
}

export interface SearchParams {
  destination: string;
  checkIn: Date;
  checkOut: Date;
  guests: {
    adults: number;
    children: number;
  };
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Booking {
  id: string;
  hotelId: string;
  roomId: string;
  userId: string;
  checkIn: Date;
  checkOut: Date;
  guests: {
    adults: number;
    children: number;
  };
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}