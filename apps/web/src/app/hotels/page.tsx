'use client';

import { useState } from 'react';
import HotelSearch from '../../components/hotels/HotelSearch';
import HotelList, { Hotel } from '../../components/hotels/HotelList';
import RoomSelection from '../../components/hotels/RoomSelection';
import BookingForm, { BookingData } from '../../components/hotels/BookingForm';
import PaymentProcess, { PaymentResult } from '../../components/hotels/PaymentProcess';
import { Typography } from '@/components/ui/typography';
import { Section } from '@/components/ui/section';
import { Button } from '@/components/ui/button';

type BookingStep = 'search' | 'results' | 'rooms' | 'booking' | 'payment' | 'confirmation';

interface SearchData {
  destination: string;
  checkIn: string;
  checkOut: string;
  rooms: number;
  adults: number;
  children: number;
}

// Mock data for demonstration
const mockHotels: Hotel[] = [
  {
    id: '1',
    name: 'The Grand Hotel Saigon',
    description: 'Khách sạn cao cấp 5 sao với view thành phố tuyệt đẹp, nằm ngay trung tâm Quận 1.',
    starRating: 5,
    rating: 9.2,
    reviewCount: 1250,
    location: {
      address: '8 Đồng Khởi, Bến Nghé, Quận 1',
      city: 'TP. Hồ Chí Minh',
      country: 'Việt Nam'
    },
    images: [
      '/images/hotel-1.jpg',
      '/images/hotel-1-2.jpg'
    ],
    rooms: [
      {
        type: 'deluxe',
        name: 'Deluxe City View',
        description: 'Phòng deluxe với view thành phố, giường King size, phòng tắm marble cao cấp.',
        images: ['/images/room-1.jpg'],
        amenities: ['Wi-Fi miễn phí', 'Minibar', 'Tivi LCD 55 inch', 'Máy pha cà phê'],
        capacity: {
          adults: 2,
          children: 1,
          beds: 1
        },
        size: 35,
        pricing: {
          basePrice: 2500000,
          currency: 'VND',
          taxes: 250000
        },
        availability: {
          total: 10,
          available: 5
        }
      },
      {
        type: 'suite',
        name: 'Executive Suite',
        description: 'Suite cao cấp với phòng khách riêng, ban công view sông Sài Gòn.',
        images: ['/images/room-2.jpg'],
        amenities: ['Wi-Fi miễn phí', 'Minibar', 'Tivi LCD 65 inch', 'Máy pha cà phê', 'Ban công'],
        capacity: {
          adults: 4,
          children: 2,
          beds: 2
        },
        size: 65,
        pricing: {
          basePrice: 4200000,
          currency: 'VND',
          taxes: 420000
        },
        availability: {
          total: 5,
          available: 2
        }
      }
    ],
    amenities: {
      general: ['Wi-Fi miễn phí', 'Bãi đỗ xe', 'Dịch vụ phòng 24/7'],
      business: ['Trung tâm hội nghị', 'Dịch vụ in ấn'],
      wellness: ['Hồ bơi', 'Phòng gym', 'Spa'],
      dining: ['Nhà hàng', 'Quầy bar', 'Room service']
    },
    startingPrice: 2500000
  },
  {
    id: '2',
    name: 'Liberty Central Saigon Centre',
    description: 'Khách sạn boutique 4 sao với thiết kế hiện đại, gần chợ Bến Thành và nhà hát thành phố.',
    starRating: 4,
    rating: 8.8,
    reviewCount: 890,
    location: {
      address: '179 Nguyễn Thị Minh Khai, Phường 6, Quận 3',
      city: 'TP. Hồ Chí Minh',
      country: 'Việt Nam'
    },
    images: [
      '/images/hotel-2.jpg'
    ],
    rooms: [
      {
        type: 'standard',
        name: 'Superior Room',
        description: 'Phòng superior với nội thất hiện đại, cửa sổ lớn đón ánh sáng tự nhiên.',
        images: ['/images/room-3.jpg'],
        amenities: ['Wi-Fi miễn phí', 'Tivi LCD', 'Két an toàn', 'Máy sấy tóc'],
        capacity: {
          adults: 2,
          children: 1,
          beds: 1
        },
        size: 28,
        pricing: {
          basePrice: 1800000,
          currency: 'VND',
          taxes: 180000
        },
        availability: {
          total: 15,
          available: 8
        }
      },
      {
        type: 'deluxe',
        name: 'Deluxe Room',
        description: 'Phòng deluxe rộng rãi với khu vực làm việc và ghế sofa thư giãn.',
        images: ['/images/room-4.jpg'],
        amenities: ['Wi-Fi miễn phí', 'Tivi LCD', 'Minibar', 'Bàn làm việc', 'Ghế sofa'],
        capacity: {
          adults: 2,
          children: 2,
          beds: 1
        },
        size: 32,
        pricing: {
          basePrice: 2200000,
          currency: 'VND',
          taxes: 220000
        },
        availability: {
          total: 8,
          available: 3
        }
      }
    ],
    amenities: {
      general: ['Wi-Fi miễn phí', 'Bãi đỗ xe', 'Lễ tân 24/7'],
      business: ['Phòng họp', 'Dịch vụ photocopy'],
      wellness: ['Hồ bơi ngoài trời', 'Phòng gym'],
      dining: ['Nhà hàng', 'Café']
    },
    startingPrice: 1800000
  }
];

export default function HotelsPage() {
  const [currentStep, setCurrentStep] = useState<BookingStep>('search');
  const [searchData, setSearchData] = useState<SearchData | null>(null);
  const [searchResults, setSearchResults] = useState<Hotel[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (data: SearchData) => {
    setLoading(true);
    setSearchData(data);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Filter mock data based on search criteria (simplified)
      const results = mockHotels.filter(hotel => 
        hotel.location.city.toLowerCase().includes(data.destination.toLowerCase()) ||
        hotel.name.toLowerCase().includes(data.destination.toLowerCase()) ||
        data.destination === ''
      );
      
      setSearchResults(results);
      setCurrentStep('results');
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectHotel = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setCurrentStep('rooms');
  };

  const handleSelectRoom = (room: any, quantity: number) => {
    setSelectedRoom({ room, quantity });
    setCurrentStep('booking');
  };

  const handleSubmitBooking = (data: BookingData) => {
    setBookingData(data);
    setCurrentStep('payment');
  };

  const handlePaymentComplete = (result: PaymentResult) => {
    if (result.success) {
      setCurrentStep('confirmation');
    } else {
      // Handle payment failure
      console.error('Payment failed:', result.message);
    }
  };

  const handleBackToSearch = () => {
    setCurrentStep('search');
    setSearchResults([]);
    setSelectedHotel(null);
    setSelectedRoom(null);
    setBookingData(null);
  };

  const handleBackToResults = () => {
    setCurrentStep('results');
    setSelectedHotel(null);
    setSelectedRoom(null);
  };

  const handleBackToRooms = () => {
    setCurrentStep('rooms');
    setSelectedRoom(null);
    setBookingData(null);
  };

  const handleBackToBooking = () => {
    setCurrentStep('booking');
    setBookingData(null);
  };

  return (
    <Section className="min-h-screen bg-gray-50">
      {currentStep === 'search' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <Typography variant="h1" className="text-4xl font-bold text-gray-900 mb-4">
              Booking khách sạn
            </Typography>
            <Typography variant="large" className="text-xl text-gray-600">
              Tìm kiếm và đặt phòng khách sạn với giá tốt nhất
            </Typography>
          </div>

          <HotelSearch onSearch={handleSearch} loading={loading} />
        </div>
      )}

      {currentStep === 'results' && searchData && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={handleBackToSearch}
              className="text-blue-600 hover:text-blue-700 mb-4"
            >
              ← Tìm kiếm mới
            </Button>
            <Typography variant="h1" className="text-2xl font-bold text-gray-900 mb-2">
              Kết quả tìm kiếm khách sạn
            </Typography>
            <Typography variant="p" className="text-gray-600">
              {searchResults.length} khách sạn được tìm thấy tại {searchData.destination || 'tất cả điểm đến'}
            </Typography>
          </div>

          <HotelSearch onSearch={handleSearch} loading={loading} />
          
          <div className="mt-8">
            <HotelList
              hotels={searchResults}
              loading={loading}
              onSelectHotel={handleSelectHotel}
            />
          </div>
        </div>
      )}

      {currentStep === 'rooms' && selectedHotel && searchData && (
        <RoomSelection
          hotel={selectedHotel}
          searchData={searchData}
          onBack={handleBackToResults}
          onSelectRoom={handleSelectRoom}
        />
      )}

      {currentStep === 'booking' && selectedHotel && selectedRoom && searchData && (
        <BookingForm
          hotel={selectedHotel}
          room={selectedRoom.room}
          quantity={selectedRoom.quantity}
          searchData={searchData}
          onBack={handleBackToRooms}
          onSubmitBooking={handleSubmitBooking}
        />
      )}

      {currentStep === 'payment' && bookingData && (
        <PaymentProcess
          bookingData={bookingData}
          onBack={handleBackToBooking}
          onPaymentComplete={handlePaymentComplete}
        />
      )}

      {currentStep === 'confirmation' && (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <Typography variant="h2" className="text-2xl font-bold text-gray-900 mb-4">
              Đặt phòng thành công!
            </Typography>
            <Typography variant="p" className="text-gray-600 mb-8">
              Cảm ơn bạn đã sử dụng dịch vụ của GoSafe. Thông tin đặt phòng đã được gửi về email của bạn.
            </Typography>
            <div className="flex justify-center space-x-4">
              <Button
                onClick={() => window.location.href = '/'}
                className="px-6 py-3"
              >
                Về trang chủ
              </Button>
              <Button
                variant="secondary"
                onClick={handleBackToSearch}
                className="px-6 py-3"
              >
                Đặt phòng mới
              </Button>
            </div>
          </div>
        </div>
      )}
    </Section>
  );
}
