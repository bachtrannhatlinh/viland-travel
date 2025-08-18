'use client';

import { useState } from 'react';
import { Star, Users, Bed, ArrowLeft, Check, Wifi, Car, Coffee } from 'lucide-react';
import Image from 'next/image';
import { Hotel, Room } from './HotelList';
import { Typography } from '@/components/ui/typography';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface RoomSelectionProps {
  hotel: Hotel;
  searchData: {
    checkIn: string;
    checkOut: string;
    rooms: number;
    adults: number;
    children: number;
  };
  onBack: () => void;
  onSelectRoom: (room: Room, quantity: number, hotel: Hotel) => void;
}

interface SelectedRoom {
  room: Room;
  quantity: number;
}

const amenityIcons: Record<string, any> = {
  'Wi-Fi miễn phí': Wifi,
  'Bãi đỗ xe': Car,
  'Minibar': Coffee,
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

function RoomCard({ 
  room, 
  nights, 
  selectedQuantity, 
  onQuantityChange 
}: { 
  room: Room; 
  nights: number;
  selectedQuantity: number;
  onQuantityChange: (quantity: number) => void;
}) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const totalPrice = room.pricing.basePrice * nights;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="md:flex gap-6">
          {/* Room Image */}
          <div className="md:w-1/3 mb-4 md:mb-0">
            <div className="relative h-48 rounded-lg overflow-hidden">
              <Image
                src={room.images[0] || '/images/room-placeholder.jpg'}
                alt={room.name}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Room Details */}
          <div className="md:w-2/3">
            <div className="flex justify-between items-start mb-3">
              <div>
                <Typography variant="h3" className="text-xl font-semibold text-gray-900 mb-1">
                  {room.name}
                </Typography>
                <Badge variant="secondary" className="text-sm text-gray-600">
                  {room.type}
                </Badge>
              </div>
              <div className="text-right">
                <Typography variant="large" className="text-2xl font-bold text-blue-600">
                  {formatPrice(totalPrice)}
                </Typography>
                <Typography variant="small" className="text-sm text-gray-600">
                  {nights} đêm
                </Typography>
              </div>
            </div>

            {/* Room Info */}
            <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                <Typography variant="small">{room.capacity.adults} người lớn</Typography>
              </div>
              <div className="flex items-center">
                <Bed className="w-4 h-4 mr-1" />
                <Typography variant="small">{room.capacity.beds} giường</Typography>
              </div>
              <Typography variant="small">{room.size}m²</Typography>
            </div>

            {/* Description */}
            <Typography variant="p" className="text-gray-600 text-sm mb-3">
              {room.description}
            </Typography>

            {/* Amenities */}
            <div className="flex flex-wrap gap-2 mb-4">
              {room.amenities.slice(0, 6).map((amenity, index) => (
                <Badge key={index} variant="outline" className="flex items-center text-xs text-gray-600">
                  <AmenityIcon amenity={amenity} />
                  <Typography variant="small" className="ml-1">{amenity}</Typography>
                </Badge>
              ))}
            </div>

            {/* Room Selection */}
            <div className="flex justify-between items-center">
              <Typography variant="small" className="text-green-600 font-medium">
                {room.availability.available} phòng còn trống
              </Typography>
              
              <div className="flex items-center gap-3">
                <Label className="text-sm font-medium text-gray-700">
                  Số phòng:
                </Label>
                <Select 
                  value={selectedQuantity.toString()} 
                  onValueChange={(value) => onQuantityChange(parseInt(value))}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[0, ...Array.from({ length: Math.min(room.availability.available, 5) }, (_, i) => i + 1)].map(num => (
                      <SelectItem key={num} value={num.toString()}>
                        {num === 0 ? 'Không chọn' : `${num} phòng`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function RoomSelection({ hotel, searchData, onBack, onSelectRoom }: RoomSelectionProps) {
  const [selectedRooms, setSelectedRooms] = useState<Record<string, number>>({});

  const checkInDate = new Date(searchData.checkIn);
  const checkOutDate = new Date(searchData.checkOut);
  const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

  const handleQuantityChange = (roomIndex: number, quantity: number) => {
    setSelectedRooms(prev => ({
      ...prev,
      [roomIndex]: quantity
    }));
  };

  const handleConfirmSelection = () => {
    const selectedRoomsList = Object.entries(selectedRooms)
      .filter(([_, quantity]) => quantity > 0)
      .map(([roomIndex, quantity]) => ({
        room: hotel.rooms[parseInt(roomIndex)],
        quantity
      }));

    if (selectedRoomsList.length > 0) {
      // Pass the first selected room for now - in a real app, you'd handle multiple rooms
      const firstSelection = selectedRoomsList[0];
      onSelectRoom(firstSelection.room, firstSelection.quantity, hotel);
    }
  };

  const totalSelectedRooms = Object.values(selectedRooms).reduce((sum, quantity) => sum + quantity, 0);
  const totalPrice = Object.entries(selectedRooms).reduce((sum, [roomIndex, quantity]) => {
    const room = hotel.rooms[parseInt(roomIndex)];
    return sum + (room.pricing.basePrice * nights * quantity);
  }, 0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-4 p-0"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại danh sách khách sạn
        </Button>

        <Card>
          <CardContent className="p-6">
            <div className="md:flex justify-between items-start">
              <div>
                <Typography variant="h1" className="text-2xl font-bold text-gray-900 mb-2">
                  {hotel.name}
                </Typography>
                <div className="flex items-center space-x-2 mb-2">
                  <StarRating rating={hotel.starRating} />
                  <Typography variant="small" className="text-sm text-gray-600">
                    {hotel.starRating} sao
                  </Typography>
                  <Badge className="bg-blue-600 text-white">
                    {hotel.rating}
                  </Badge>
                  <Typography variant="small" className="text-sm text-gray-600">
                    ({hotel.reviewCount} đánh giá)
                  </Typography>
                </div>
                <Typography variant="p" className="text-gray-600">
                  {hotel.location && hotel.location.address ? hotel.location.address : ''}
                  {hotel.location && hotel.location.city ? `, ${hotel.location.city}` : ''}
                </Typography>
              </div>
              
              <Card className="bg-blue-50 mt-4 md:mt-0">
                <CardContent className="p-4">
                  <Typography variant="small" className="text-sm text-gray-600 mb-1">
                    {searchData.checkIn} - {searchData.checkOut}
                  </Typography>
                  <Typography variant="large" className="text-lg font-semibold text-blue-600">
                    {nights} đêm, {searchData.adults} người lớn
                    {searchData.children > 0 && `, ${searchData.children} trẻ em`}
                  </Typography>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Room List */}
      <div className="space-y-4 mb-8">
        <Typography variant="h2" className="text-xl font-semibold text-gray-900 mb-4">
          Chọn phòng
        </Typography>
        {Array.isArray(hotel.rooms) && hotel.rooms.length > 0 ? (
          hotel.rooms.map((room, index) => (
            <RoomCard
              key={index}
              room={room}
              nights={nights}
              selectedQuantity={selectedRooms[index] || 0}
              onQuantityChange={(quantity) => handleQuantityChange(index, quantity)}
            />
          ))
        ) : (
          <Typography variant="p" className="text-gray-600">Không có phòng nào khả dụng cho khách sạn này.</Typography>
        )}
      </div>

      {/* Booking Summary */}
      {totalSelectedRooms > 0 && (
        <Card className="fixed bottom-0 left-0 right-0 border-t shadow-lg z-50">
          <CardContent className="p-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <div>
                <Typography variant="large" className="text-lg font-semibold text-gray-900">
                  {totalSelectedRooms} phòng đã chọn
                </Typography>
                <Typography variant="large" className="text-2xl font-bold text-blue-600">
                  {formatPrice(totalPrice)}
                </Typography>
              </div>
              
              <Button
                onClick={handleConfirmSelection}
                className="px-8 py-3 font-semibold"
              >
                Tiếp tục đặt phòng
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
