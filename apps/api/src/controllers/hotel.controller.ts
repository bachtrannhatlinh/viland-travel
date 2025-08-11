import { Request, Response } from 'express';
import { Hotel, HotelStatus, RoomType } from '../entities/Hotel.entity';
import { Booking, BookingType, BookingStatus } from '../entities/Booking.entity';
import { Payment, PaymentStatus, PaymentMethod } from '../entities/Payment.entity';
import { PaymentService } from '../services/payment/PaymentService';
import { PaymentRequest } from '../types/payment.types';
import { Repository } from 'typeorm';

interface AuthRequest extends Request {
  user?: any;
}

// Mock hotels data for demonstration
const mockHotels = [
  {
    id: '1',
    name: 'The Grand Hotel Saigon',
    description: 'Khách sạn cao cấp 5 sao với view thành phố tuyệt đẹp, nằm ngay trung tâm Quận 1.',
    status: HotelStatus.ACTIVE,
    category: 'hotel' as any,
    starRating: 5,
    rating: 9.2,
    reviewCount: 1250,
    location: {
      address: '8 Đồng Khởi, Bến Nghé, Quận 1',
      city: 'TP. Hồ Chí Minh',
      country: 'Việt Nam',
      coordinates: { lat: 10.7769, lng: 106.7009 }
    },
    images: ['/images/hotel-1.jpg', '/images/hotel-1-2.jpg'],
    rooms: [
      {
        type: RoomType.DELUXE,
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
        type: RoomType.SUITE,
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
    policies: {
      checkIn: { from: '14:00', to: '23:00' },
      checkOut: { from: '06:00', to: '12:00' },
      cancellation: {
        freeUntil: 24,
        penalty: 100,
        terms: 'Hủy miễn phí trước 24 giờ check-in'
      },
      children: 'Trẻ em dưới 12 tuổi ở miễn phí với người lớn',
      pets: 'Không cho phép thú cưng',
      smoking: 'Không hút thuốc trong phòng'
    },
    contact: {
      phone: '+84 28 3823 2999',
      email: 'info@grandhotelsaigon.com',
      website: 'https://grandhotelsaigon.com'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Liberty Central Saigon Centre',
    description: 'Khách sạn boutique 4 sao với thiết kế hiện đại, gần chợ Bến Thành và nhà hát thành phố.',
    status: HotelStatus.ACTIVE,
    category: 'hotel' as any,
    starRating: 4,
    rating: 8.8,
    reviewCount: 890,
    location: {
      address: '179 Nguyễn Thị Minh Khai, Phường 6, Quận 3',
      city: 'TP. Hồ Chí Minh',
      country: 'Việt Nam',
      coordinates: { lat: 10.7692, lng: 106.6917 }
    },
    images: ['/images/hotel-2.jpg'],
    rooms: [
      {
        type: RoomType.STANDARD,
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
        type: RoomType.DELUXE,
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
    policies: {
      checkIn: { from: '14:00', to: '24:00' },
      checkOut: { from: '06:00', to: '12:00' },
      cancellation: {
        freeUntil: 24,
        penalty: 50,
        terms: 'Hủy miễn phí trước 24 giờ check-in'
      },
      children: 'Trẻ em dưới 6 tuổi ở miễn phí với người lớn',
      pets: 'Không cho phép thú cưng',
      smoking: 'Khu vực hút thuốc riêng'
    },
    contact: {
      phone: '+84 28 3822 5678',
      email: 'info@libertycentral.com.vn'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const searchHotels = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      destination, 
      checkIn, 
      checkOut, 
      rooms = 1, 
      adults = 2, 
      children = 0,
      minPrice,
      maxPrice,
      starRating,
      amenities
    } = req.query;

    // In a real implementation, you would query the database
    // For now, we'll filter the mock data
    let filteredHotels = mockHotels;

    if (destination) {
      const dest = String(destination).toLowerCase();
      filteredHotels = filteredHotels.filter(hotel => 
        hotel.location.city.toLowerCase().includes(dest) ||
        hotel.name.toLowerCase().includes(dest) ||
        hotel.location.address.toLowerCase().includes(dest)
      );
    }

    if (minPrice || maxPrice) {
      filteredHotels = filteredHotels.filter(hotel => {
        const startingPrice = Math.min(...hotel.rooms.map(room => room.pricing.basePrice));
        const min = minPrice ? parseFloat(String(minPrice)) : 0;
        const max = maxPrice ? parseFloat(String(maxPrice)) : Infinity;
        return startingPrice >= min && startingPrice <= max;
      });
    }

    if (starRating) {
      const rating = parseInt(String(starRating));
      filteredHotels = filteredHotels.filter(hotel => hotel.starRating >= rating);
    }

    // Add calculated fields
    const enrichedHotels = filteredHotels.map(hotel => ({
      ...hotel,
      startingPrice: Math.min(...hotel.rooms.map(room => room.pricing.basePrice)),
      totalRooms: hotel.rooms.reduce((sum, room) => sum + room.availability.total, 0),
      availableRooms: hotel.rooms.reduce((sum, room) => sum + room.availability.available, 0),
      isBookable: hotel.status === HotelStatus.ACTIVE && 
                  hotel.rooms.some(room => room.availability.available > 0)
    }));

    res.json({
      success: true,
      data: enrichedHotels,
      total: enrichedHotels.length,
      searchParams: {
        destination,
        checkIn,
        checkOut,
        rooms: parseInt(String(rooms)),
        adults: parseInt(String(adults)),
        children: parseInt(String(children))
      }
    });
  } catch (error) {
    console.error('Search hotels error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tìm kiếm khách sạn',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getHotelDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { hotelId } = req.params;

    // Find hotel in mock data
    const hotel = mockHotels.find(h => h.id === hotelId);

    if (!hotel) {
      res.status(404).json({
        success: false,
        message: 'Không tìm thấy khách sạn'
      });
      return;
    }

    // Add calculated fields
    const enrichedHotel = {
      ...hotel,
      startingPrice: Math.min(...hotel.rooms.map(room => room.pricing.basePrice)),
      totalRooms: hotel.rooms.reduce((sum, room) => sum + room.availability.total, 0),
      availableRooms: hotel.rooms.reduce((sum, room) => sum + room.availability.available, 0),
      isBookable: hotel.status === HotelStatus.ACTIVE && 
                  hotel.rooms.some(room => room.availability.available > 0)
    };

    res.json({
      success: true,
      data: enrichedHotel
    });
  } catch (error) {
    console.error('Get hotel details error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin khách sạn',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const bookHotel = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      hotelId,
      roomType,
      quantity = 1,
      checkIn,
      checkOut,
      guests,
      contactInfo,
      specialRequests,
      totalAmount,
      paymentMethod
    } = req.body;

    // Validate required fields
    if (!hotelId || !roomType || !checkIn || !checkOut || !contactInfo || !totalAmount || !paymentMethod) {
      res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc'
      });
      return;
    }

    // Find hotel
    const hotel = mockHotels.find(h => h.id === hotelId);
    if (!hotel) {
      res.status(404).json({
        success: false,
        message: 'Không tìm thấy khách sạn'
      });
      return;
    }

    // Find room
    const room = hotel.rooms.find(r => r.type === roomType);
    if (!room) {
      res.status(404).json({
        success: false,
        message: 'Không tìm thấy loại phòng'
      });
      return;
    }

    // Check availability
    if (room.availability.available < quantity) {
      res.status(400).json({
        success: false,
        message: 'Không đủ phòng trống'
      });
      return;
    }

    // Generate booking number
    const bookingNumber = 'BK' + Date.now().toString();

    // Calculate nights
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

    // Create booking data
    const bookingData = {
      bookingNumber,
      bookingType: BookingType.HOTEL,
      status: BookingStatus.PENDING,
      userId: req.user?.id || 'guest',
      serviceId: hotelId,
      bookingDetails: {
        serviceName: hotel.name,
        description: `${room.name} - ${quantity} phòng, ${nights} đêm`,
        duration: `${nights} đêm`,
        startDate: checkIn,
        endDate: checkOut,
        participants: guests.adults + guests.children,
        specialRequests,
        contactInfo,
        roomDetails: {
          type: roomType,
          name: room.name,
          quantity,
          pricePerNight: room.pricing.basePrice
        },
        guests
      },
      totalAmount,
      currency: 'VND'
    };

    try {
      // Initialize payment service with mock config
      const paymentService = new PaymentService({
        vnpay: {
          tmnCode: 'VNPAY_TMN_CODE',
          hashSecret: 'VNPAY_HASH_SECRET',
          url: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
          apiUrl: 'https://sandbox.vnpayment.vn/merchant_webapi/api/transaction',
          returnUrl: process.env.VNPAY_RETURN_URL || 'http://localhost:3000/payment/return',
          notifyUrl: process.env.VNPAY_NOTIFY_URL || 'http://localhost:3001/api/payment/vnpay/callback'
        }
      });

      // Create payment request
      const paymentRequest: PaymentRequest = {
        bookingId: bookingNumber,
        amount: totalAmount,
        currency: 'VND',
        description: `Thanh toán đặt phòng ${hotel.name} - ${bookingNumber}`,
        customerInfo: {
          name: `${contactInfo.firstName} ${contactInfo.lastName}`,
          email: contactInfo.email,
          phone: contactInfo.phone
        }
      };

      // Process payment
      const paymentResult = await paymentService.createPayment(
        paymentRequest, 
        paymentMethod as any
      );

      if (paymentResult.success) {
        // In a real implementation, save to database here
        console.log('Booking created:', bookingData);
        console.log('Payment processed:', paymentResult);

        // Update room availability (in real app, this would be in database)
        room.availability.available -= quantity;

        if (paymentResult.paymentUrl) {
          // For payment gateways that require redirect
          res.json({
            success: true,
            message: 'Đang chuyển hướng đến trang thanh toán',
            redirectUrl: paymentResult.paymentUrl,
            bookingNumber,
            transactionId: paymentResult.transactionId
          });
        } else {
          // Direct payment success
          res.json({
            success: true,
            message: 'Đặt phòng và thanh toán thành công',
            bookingNumber,
            transactionId: paymentResult.transactionId,
            booking: bookingData
          });
        }
      } else {
        res.status(400).json({
          success: false,
          message: paymentResult.error || 'Thanh toán thất bại'
        });
      }
    } catch (paymentError) {
      console.error('Payment processing error:', paymentError);
      // Fallback: simulate successful booking for demo
      res.json({
        success: true,
        message: 'Đặt phòng thành công (Demo mode)',
        bookingNumber,
        transactionId: 'DEMO_' + Date.now(),
        booking: bookingData
      });
    }
  } catch (error) {
    console.error('Book hotel error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi đặt phòng',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getHotelBookings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Chưa đăng nhập'
      });
      return;
    }

    // In a real implementation, query the database
    // For now, return empty array
    res.json({
      success: true,
      data: [],
      message: 'Lịch sử đặt phòng - tính năng đang phát triển'
    });
  } catch (error) {
    console.error('Get hotel bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy lịch sử đặt phòng',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const cancelHotelBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { bookingId } = req.params;
    const { reason } = req.body;

    // In a real implementation, find and update booking in database
    res.json({
      success: true,
      message: 'Hủy đặt phòng thành công',
      bookingId,
      reason
    });
  } catch (error) {
    console.error('Cancel hotel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi hủy đặt phòng',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const addHotelReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { hotelId } = req.params;
    const { rating, comment, images } = req.body;

    // In a real implementation, save review to database
    res.json({
      success: true,
      message: 'Đánh giá đã được thêm thành công',
      review: {
        hotelId,
        rating,
        comment,
        images,
        userId: req.user?.id,
        createdAt: new Date()
      }
    });
  } catch (error) {
    console.error('Add hotel review error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi thêm đánh giá',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
