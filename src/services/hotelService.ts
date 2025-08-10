import { Hotel, SearchParams } from '@/types/hotel';
import hotelRoom1 from '@/assets/hotel-room-1.jpg';
import hotelRoom2 from '@/assets/hotel-room-2.jpg';
import hotelRoom3 from '@/assets/hotel-room-3.jpg';

// Mock hotel data for demonstration
const mockHotels: Hotel[] = [
  {
    id: '1',
    name: 'Grand Ocean Resort',
    location: {
      city: 'Miami',
      country: 'USA',
      address: '123 Ocean Drive, Miami Beach',
      coordinates: { lat: 25.7617, lng: -80.1918 }
    },
    rating: 4.5,
    reviewCount: 1234,
    images: [hotelRoom1],
    pricePerNight: 250,
    currency: 'USD',
    amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Beach Access'],
    description: 'Luxury oceanfront resort with stunning views',
    rooms: [
      {
        id: '1-1',
        type: 'Ocean View Suite',
        maxGuests: 4,
        pricePerNight: 250,
        amenities: ['Ocean View', 'Balcony', 'Mini Bar'],
        images: [hotelRoom1],
        availableRooms: 3
      }
    ]
  },
  {
    id: '2',
    name: 'Urban Boutique Hotel',
    location: {
      city: 'New York',
      country: 'USA',
      address: '456 Broadway, Manhattan',
      coordinates: { lat: 40.7589, lng: -73.9851 }
    },
    rating: 4.3,
    reviewCount: 876,
    images: [hotelRoom2],
    pricePerNight: 180,
    currency: 'USD',
    amenities: ['WiFi', 'Gym', 'Restaurant', 'Business Center'],
    description: 'Modern boutique hotel in the heart of Manhattan',
    rooms: [
      {
        id: '2-1',
        type: 'City View Room',
        maxGuests: 2,
        pricePerNight: 180,
        amenities: ['City View', 'Work Desk', 'Smart TV'],
        images: [hotelRoom2],
        availableRooms: 5
      }
    ]
  },
  {
    id: '3',
    name: 'Mountain Lodge Retreat',
    location: {
      city: 'Aspen',
      country: 'USA',
      address: '789 Mountain Road, Aspen',
      coordinates: { lat: 39.1911, lng: -106.8175 }
    },
    rating: 4.7,
    reviewCount: 543,
    images: [hotelRoom3],
    pricePerNight: 320,
    currency: 'USD',
    amenities: ['WiFi', 'Ski Access', 'Fireplace', 'Spa', 'Restaurant'],
    description: 'Cozy mountain retreat with direct ski access',
    rooms: [
      {
        id: '3-1',
        type: 'Mountain Cabin',
        maxGuests: 6,
        pricePerNight: 320,
        amenities: ['Mountain View', 'Fireplace', 'Kitchen'],
        images: [hotelRoom3],
        availableRooms: 2
      }
    ]
  }
];

export class HotelService {
  static async searchHotels(params: SearchParams): Promise<Hotel[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Filter hotels based on destination
    const filtered = mockHotels.filter(hotel => 
      hotel.location.city.toLowerCase().includes(params.destination.toLowerCase()) ||
      hotel.location.country.toLowerCase().includes(params.destination.toLowerCase())
    );
    
    return filtered.length > 0 ? filtered : mockHotels;
  }

  static async getHotelById(id: string): Promise<Hotel | null> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockHotels.find(hotel => hotel.id === id) || null;
  }

  static async getCurrentLocation(): Promise<{ lat: number; lng: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          reject(new Error('Unable to retrieve your location'));
        }
      );
    });
  }

  static async getCityFromCoordinates(lat: number, lng: number): Promise<string> {
    // In a real app, you'd use a reverse geocoding service
    // For demo purposes, return a mock city
    await new Promise(resolve => setTimeout(resolve, 500));
    return 'Current Location';
  }
}