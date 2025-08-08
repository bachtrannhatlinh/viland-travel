import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

// Mock data - same as backend
const mockHotels = [
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
    images: ['/images/hotel-1.jpg', '/images/hotel-1-2.jpg'],
    rooms: [
      {
        type: 'deluxe',
        name: 'Deluxe City View',
        description: 'Phòng deluxe với view thành phố, giường King size, phòng tắm marble cao cấp.',
        images: ['/images/room-1.jpg'],
        amenities: ['Wi-Fi miễn phí', 'Minibar', 'Tivi LCD 55 inch', 'Máy pha cà phê'],
        capacity: { adults: 2, children: 1, beds: 1 },
        size: 35,
        pricing: { basePrice: 2500000, currency: 'VND', taxes: 250000 },
        availability: { total: 10, available: 5 }
      },
      {
        type: 'suite',
        name: 'Executive Suite',
        description: 'Suite cao cấp với phòng khách riêng, ban công view sông Sài Gòn.',
        images: ['/images/room-2.jpg'],
        amenities: ['Wi-Fi miễn phí', 'Minibar', 'Tivi LCD 65 inch', 'Máy pha cà phê', 'Ban công'],
        capacity: { adults: 4, children: 2, beds: 2 },
        size: 65,
        pricing: { basePrice: 4200000, currency: 'VND', taxes: 420000 },
        availability: { total: 5, available: 2 }
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
    images: ['/images/hotel-2.jpg'],
    rooms: [
      {
        type: 'standard',
        name: 'Superior Room',
        description: 'Phòng superior với nội thất hiện đại, cửa sổ lớn đón ánh sáng tự nhiên.',
        images: ['/images/room-3.jpg'],
        amenities: ['Wi-Fi miễn phí', 'Tivi LCD', 'Két an toàn', 'Máy sấy tóc'],
        capacity: { adults: 2, children: 1, beds: 1 },
        size: 28,
        pricing: { basePrice: 1800000, currency: 'VND', taxes: 180000 },
        availability: { total: 15, available: 8 }
      },
      {
        type: 'deluxe',
        name: 'Deluxe Room',
        description: 'Phòng deluxe rộng rãi với khu vực làm việc và ghế sofa thư giãn.',
        images: ['/images/room-4.jpg'],
        amenities: ['Wi-Fi miễn phí', 'Tivi LCD', 'Minibar', 'Bàn làm việc', 'Ghế sofa'],
        capacity: { adults: 2, children: 2, beds: 1 },
        size: 32,
        pricing: { basePrice: 2200000, currency: 'VND', taxes: 220000 },
        availability: { total: 8, available: 3 }
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const destination = searchParams.get('destination') || '';
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const rooms = parseInt(searchParams.get('rooms') || '1');
    const adults = parseInt(searchParams.get('adults') || '2');
    const children = parseInt(searchParams.get('children') || '0');

    // Filter hotels based on destination
    let filteredHotels = mockHotels;
    
    if (destination) {
      const dest = destination.toLowerCase();
      filteredHotels = filteredHotels.filter(hotel => 
        hotel.location.city.toLowerCase().includes(dest) ||
        hotel.name.toLowerCase().includes(dest) ||
        hotel.location.address.toLowerCase().includes(dest)
      );
    }

    // Add calculated fields
    const enrichedHotels = filteredHotels.map(hotel => ({
      ...hotel,
      totalRooms: hotel.rooms.reduce((sum, room) => sum + room.availability.total, 0),
      availableRooms: hotel.rooms.reduce((sum, room) => sum + room.availability.available, 0),
      isBookable: hotel.rooms.some(room => room.availability.available > 0)
    }));

    return NextResponse.json({
      success: true,
      data: enrichedHotels,
      total: enrichedHotels.length,
      searchParams: {
        destination,
        checkIn,
        checkOut,
        rooms,
        adults,
        children
      }
    });
  } catch (error) {
    console.error('Search hotels error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Lỗi khi tìm kiếm khách sạn',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
