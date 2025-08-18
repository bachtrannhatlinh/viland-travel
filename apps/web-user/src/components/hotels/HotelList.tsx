'use client';

import { Star, MapPin, Wifi, Car, Coffee, Utensils, Waves, Dumbbell } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';

export interface Hotel {
  id: string;
  name: string;
  description: string;
  starRating: number;
  rating: number;
  reviewCount: number;
  location: {
    address: string;
    city: string;
    country: string;
  };
  images: string[];
  rooms: Room[];
  amenities: {
    general: string[];
    business: string[];
    wellness: string[];
    dining: string[];
  };
  startingPrice: number;
}

export interface Room {
  id?: string;
  type: string;
  name: string;
  description: string;
  images: string[];
  amenities: string[];
  capacity: {
    adults: number;
    children: number;
    beds: number;
  };
  size: number;
  pricing: {
    basePrice: number;
    currency: string;
    taxes?: number;
    fees?: number;
  };
  availability: {
    total: number;
    available: number;
  };
}

interface HotelListProps {
  hotels: Hotel[];
  loading?: boolean;
  onSelectHotel: (hotel: Hotel) => void;
}

const amenityIcons: Record<string, any> = {
  'Wi-Fi miễn phí': Wifi,
  'Bãi đỗ xe': Car,
  'Quầy bar': Coffee,
  'Nhà hàng': Utensils,
  'Hồ bơi': Waves,
  'Phòng gym': Dumbbell,
};

function AmenityIcon({ amenity }: { amenity: string }) {
  const IconComponent = amenityIcons[amenity];
  return IconComponent ? <IconComponent className="w-4 h-4" /> : null;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating
              ? 'text-yellow-400 fill-current'
              : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
}

function HotelCard({ hotel, onSelect }: { hotel: Hotel; onSelect: (hotel: Hotel) => void }) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Fallbacks for missing data
  const images = Array.isArray(hotel.images) ? hotel.images : [];
  const amenities = hotel.amenities && Array.isArray(hotel.amenities.general) ? hotel.amenities.general : [];
  const address = hotel.location?.address || '';
  const city = hotel.location?.city || '';

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="md:flex">
        {/* Hotel Image */}
        <div className="md:w-1/3">
          <div className="relative h-48 md:h-full">
            <Image
              src={images.length > 0 ? images[0] : '/images/hotel-placeholder.jpg'}
              alt={hotel.name}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Hotel Info */}
        <div className="md:w-2/3 p-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <Typography variant="h3" className="text-xl font-semibold text-gray-900 mb-1">
                {hotel.name}
              </Typography>
              <div className="flex items-center space-x-2 mb-2">
                <StarRating rating={hotel.starRating} />
                <Typography variant="small" className="text-sm text-gray-600">
                  {hotel.starRating} sao
                </Typography>
              </div>
            </div>
            <div className="text-right">
              <Typography variant="large" className="text-2xl font-bold text-blue-600">
                {formatPrice(hotel.startingPrice)}
              </Typography>
              <Typography variant="small" className="text-sm text-gray-600">
                /đêm
              </Typography>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center text-gray-600 mb-3">
            <MapPin className="w-4 h-4 mr-1" />
            <Typography variant="small" className="text-sm">{address}, {city}</Typography>
          </div>

          {/* Rating */}
          <div className="flex items-center mb-3">
            <div className="bg-blue-600 text-white px-2 py-1 rounded text-sm font-semibold">
              {hotel.rating}
            </div>
            <Typography variant="small" className="ml-2 text-sm text-gray-600">
              ({hotel.reviewCount} đánh giá)
            </Typography>
          </div>

          {/* Amenities */}
          <div className="flex flex-wrap gap-2 mb-4">
            {amenities.slice(0, 4).map((amenity) => (
              <div key={amenity} className="flex items-center bg-gray-100 rounded px-2 py-1 text-xs">
                <AmenityIcon amenity={amenity} />
                <span className="ml-1">{amenity}</span>
              </div>
            ))}
          </div>

          <Button onClick={() => onSelect(hotel)} className="mt-2">
            Xem phòng
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default function HotelList({ hotels, loading = false, onSelectHotel }: HotelListProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="md:flex">
              <div className="md:w-1/3 bg-gray-300 h-48 rounded"></div>
              <div className="md:w-2/3 md:ml-6 mt-4 md:mt-0">
                <div className="h-6 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded mb-2 w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded mb-4 w-1/2"></div>
                <div className="flex space-x-2 mb-4">
                  <div className="h-6 bg-gray-300 rounded w-16"></div>
                  <div className="h-6 bg-gray-300 rounded w-16"></div>
                  <div className="h-6 bg-gray-300 rounded w-16"></div>
                </div>
                <div className="h-10 bg-gray-300 rounded w-32"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (hotels.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <Typography variant="h3" className="text-lg font-medium text-gray-900 mb-2">
          Không tìm thấy khách sạn
        </Typography>
        <Typography variant="p" className="text-gray-600">
          Vui lòng thử thay đổi tiêu chí tìm kiếm
        </Typography>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {hotels.map((hotel) => (
        <HotelCard
          key={hotel.id}
          hotel={hotel}
          onSelect={onSelectHotel}
        />
      ))}
    </div>
  );
}
