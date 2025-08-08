import { Request, Response } from 'express';
import { CarRental, CarStatus, CarType, FuelType, TransmissionType } from '../entities/CarRental.entity';
import { Booking, BookingType, BookingStatus } from '../entities/Booking.entity';
import { PaymentService } from '../services/payment/PaymentService';
import { PaymentRequest } from '../types/payment.types';

interface AuthRequest extends Request {
  user?: any;
}

// Mock data for development - sẽ thay thế bằng database queries
const mockCars: CarRental[] = [
  {
    id: '1',
    make: 'Toyota',
    model: 'Vios',
    year: 2023,
    type: CarType.ECONOMY,
    status: CarStatus.AVAILABLE,
    licensePlate: '51F-12345',
    color: 'Trắng',
    fuelType: FuelType.GASOLINE,
    transmission: TransmissionType.AUTOMATIC,
    seats: 4,
    doors: 4,
    engineSize: 1.5,
    pricePerDay: 800000,
    currency: 'VND',
    deposit: 3000000,
    images: ['/images/car-vios-1.jpg', '/images/car-vios-2.jpg'],
    features: ['Điều hòa', 'Bluetooth', 'Camera lùi', 'Cảm biến lùi'],
    location: {
      address: '123 Nguyễn Văn Linh, Quận 7',
      city: 'TP. Hồ Chí Minh',
      country: 'Việt Nam',
      coordinates: { lat: 10.7411, lng: 106.7097 },
      pickupPoints: [
        {
          name: 'Sân bay Tân Sơn Nhất',
          address: 'Sân bay Tân Sơn Nhất, Tân Bình',
          coordinates: { lat: 10.8187, lng: 106.6521 }
        },
        {
          name: 'Trung tâm Quận 1',
          address: '123 Đồng Khởi, Quận 1',
          coordinates: { lat: 10.7769, lng: 106.7009 }
        }
      ]
    },
    mileage: 15000,
    rating: 4.5,
    reviewCount: 128,
    insurance: {
      basic: {
        included: true,
        coverage: 'Bảo hiểm cơ bản (100 triệu VNĐ)'
      },
      comprehensive: {
        available: true,
        pricePerDay: 150000,
        coverage: 'Bảo hiểm toàn diện (500 triệu VNĐ)'
      }
    },
    rentalTerms: {
      minAge: 22,
      maxAge: 70,
      licenseRequired: ['B2', 'B1'],
      additionalFees: {
        youngDriver: 200000,
        additionalDriver: 100000,
        gps: 50000,
        childSeat: 100000
      },
      fuelPolicy: 'Trả xe đầy bình như khi nhận',
      mileageLimit: 300,
      lateFee: 100000
    },
    availability: {
      calendar: [],
      minRentalDays: 1,
      maxRentalDays: 30
    },
    maintenance: {
      lastService: '2024-01-15',
      nextService: '2024-07-15',
      history: []
    },
    metadata: {},
    createdAt: new Date(),
    updatedAt: new Date(),
    get isAvailable() { return this.status === CarStatus.AVAILABLE; },
    get fullName() { return `${this.year} ${this.make} ${this.model}`; },
    get averageRating() { return this.reviewCount > 0 ? this.rating : 0; },
    get dailyRate() { return this.pricePerDay; }
  },
  {
    id: '2',
    make: 'Honda',
    model: 'City',
    year: 2023,
    type: CarType.COMPACT,
    status: CarStatus.AVAILABLE,
    licensePlate: '51F-67890',
    color: 'Bạc',
    fuelType: FuelType.GASOLINE,
    transmission: TransmissionType.AUTOMATIC,
    seats: 5,
    doors: 4,
    engineSize: 1.5,
    pricePerDay: 850000,
    currency: 'VND',
    deposit: 3000000,
    images: ['/images/car-city-1.jpg', '/images/car-city-2.jpg'],
    features: ['Điều hòa', 'Bluetooth', 'Camera lùi', 'Màn hình cảm ứng'],
    location: {
      address: '456 Võ Văn Tần, Quận 3',
      city: 'TP. Hồ Chí Minh',
      country: 'Việt Nam',
      coordinates: { lat: 10.7743, lng: 106.6916 },
      pickupPoints: [
        {
          name: 'Sân bay Tân Sơn Nhất',
          address: 'Sân bay Tân Sơn Nhất, Tân Bình',
          coordinates: { lat: 10.8187, lng: 106.6521 }
        }
      ]
    },
    mileage: 12000,
    rating: 4.7,
    reviewCount: 95,
    insurance: {
      basic: {
        included: true,
        coverage: 'Bảo hiểm cơ bản (100 triệu VNĐ)'
      },
      comprehensive: {
        available: true,
        pricePerDay: 150000,
        coverage: 'Bảo hiểm toàn diện (500 triệu VNĐ)'
      }
    },
    rentalTerms: {
      minAge: 22,
      maxAge: 70,
      licenseRequired: ['B2', 'B1'],
      additionalFees: {
        youngDriver: 200000,
        additionalDriver: 100000,
        gps: 50000,
        childSeat: 100000
      },
      fuelPolicy: 'Trả xe đầy bình như khi nhận',
      mileageLimit: 300,
      lateFee: 100000
    },
    availability: {
      calendar: [],
      minRentalDays: 1,
      maxRentalDays: 30
    },
    maintenance: {
      lastService: '2024-02-10',
      nextService: '2024-08-10',
      history: []
    },
    metadata: {},
    createdAt: new Date(),
    updatedAt: new Date(),
    get isAvailable() { return this.status === CarStatus.AVAILABLE; },
    get fullName() { return `${this.year} ${this.make} ${this.model}`; },
    get averageRating() { return this.reviewCount > 0 ? this.rating : 0; },
    get dailyRate() { return this.pricePerDay; }
  },
  {
    id: '3',
    make: 'Toyota',
    model: 'Innova',
    year: 2023,
    type: CarType.MINIVAN,
    status: CarStatus.AVAILABLE,
    licensePlate: '51F-11111',
    color: 'Xám',
    fuelType: FuelType.GASOLINE,
    transmission: TransmissionType.AUTOMATIC,
    seats: 7,
    doors: 4,
    engineSize: 2.0,
    pricePerDay: 1200000,
    currency: 'VND',
    deposit: 5000000,
    images: ['/images/car-innova-1.jpg', '/images/car-innova-2.jpg'],
    features: ['Điều hòa', 'Bluetooth', 'Camera lùi', '7 chỗ ngồi', 'Cốp rộng'],
    location: {
      address: '789 Lê Văn Sỹ, Quận Phú Nhuận',
      city: 'TP. Hồ Chí Minh',
      country: 'Việt Nam',
      coordinates: { lat: 10.7980, lng: 106.6848 },
      pickupPoints: [
        {
          name: 'Sân bay Tân Sơn Nhất',
          address: 'Sân bay Tân Sơn Nhất, Tân Bình',
          coordinates: { lat: 10.8187, lng: 106.6521 }
        },
        {
          name: 'Bến xe Miền Đông',
          address: 'Bến xe Miền Đông, Bình Thạnh',
          coordinates: { lat: 10.8142, lng: 106.7621 }
        }
      ]
    },
    mileage: 18000,
    rating: 4.6,
    reviewCount: 72,
    insurance: {
      basic: {
        included: true,
        coverage: 'Bảo hiểm cơ bản (150 triệu VNĐ)'
      },
      comprehensive: {
        available: true,
        pricePerDay: 200000,
        coverage: 'Bảo hiểm toàn diện (800 triệu VNĐ)'
      }
    },
    rentalTerms: {
      minAge: 25,
      maxAge: 65,
      licenseRequired: ['B2'],
      additionalFees: {
        youngDriver: 300000,
        additionalDriver: 150000,
        gps: 50000,
        childSeat: 100000
      },
      fuelPolicy: 'Trả xe đầy bình như khi nhận',
      mileageLimit: 250,
      lateFee: 150000
    },
    availability: {
      calendar: [],
      minRentalDays: 1,
      maxRentalDays: 30
    },
    maintenance: {
      lastService: '2024-01-20',
      nextService: '2024-07-20',
      history: []
    },
    metadata: {},
    createdAt: new Date(),
    updatedAt: new Date(),
    get isAvailable() { return this.status === CarStatus.AVAILABLE; },
    get fullName() { return `${this.year} ${this.make} ${this.model}`; },
    get averageRating() { return this.reviewCount > 0 ? this.rating : 0; },
    get dailyRate() { return this.pricePerDay; }
  }
];

export const searchCars = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      location, 
      pickupDate, 
      returnDate, 
      carType, 
      seats,
      priceMin,
      priceMax,
      transmission,
      fuelType
    } = req.query;

    // Filter cars based on search criteria
    let filteredCars = mockCars.filter(car => car.status === CarStatus.AVAILABLE);

    if (location) {
      filteredCars = filteredCars.filter(car => 
        car.location.city.toLowerCase().includes((location as string).toLowerCase()) ||
        car.location.address.toLowerCase().includes((location as string).toLowerCase())
      );
    }

    if (carType) {
      filteredCars = filteredCars.filter(car => car.type === carType);
    }

    if (seats) {
      filteredCars = filteredCars.filter(car => car.seats >= parseInt(seats as string));
    }

    if (priceMin) {
      filteredCars = filteredCars.filter(car => car.pricePerDay >= parseFloat(priceMin as string));
    }

    if (priceMax) {
      filteredCars = filteredCars.filter(car => car.pricePerDay <= parseFloat(priceMax as string));
    }

    if (transmission) {
      filteredCars = filteredCars.filter(car => car.transmission === transmission);
    }

    if (fuelType) {
      filteredCars = filteredCars.filter(car => car.fuelType === fuelType);
    }

    // Calculate rental days if dates provided
    let rentalDays = 1;
    if (pickupDate && returnDate) {
      const pickup = new Date(pickupDate as string);
      const returnD = new Date(returnDate as string);
      rentalDays = Math.max(1, Math.ceil((returnD.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24)));
    }

    // Add calculated fields
    const enrichedCars = filteredCars.map(car => ({
      ...car,
      totalPrice: car.pricePerDay * rentalDays,
      rentalDays,
      isAvailableForDates: true // In real app, check availability calendar
    }));

    res.json({
      success: true,
      data: enrichedCars,
      searchParams: {
        location,
        pickupDate,
        returnDate,
        carType,
        seats,
        priceMin,
        priceMax,
        transmission,
        fuelType,
        rentalDays
      },
      totalResults: enrichedCars.length
    });
  } catch (error) {
    console.error('Search cars error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tìm kiếm xe',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getCarDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { carId } = req.params;

    const car = mockCars.find(c => c.id === carId);
    if (!car) {
      res.status(404).json({
        success: false,
        message: 'Không tìm thấy xe'
      });
      return;
    }

    // Add additional details
    const enrichedCar = {
      ...car,
      isBookable: car.status === CarStatus.AVAILABLE,
      similarCars: mockCars
        .filter(c => c.id !== carId && c.type === car.type && c.status === CarStatus.AVAILABLE)
        .slice(0, 3)
    };

    res.json({
      success: true,
      data: enrichedCar
    });
  } catch (error) {
    console.error('Get car details error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin xe',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const bookCar = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      carId,
      pickupDate,
      returnDate,
      pickupLocation,
      returnLocation,
      driverInfo,
      contactInfo,
      additionalServices,
      specialRequests,
      totalAmount,
      paymentMethod
    } = req.body;

    // Validate required fields
    if (!carId || !pickupDate || !returnDate || !driverInfo || !contactInfo || !totalAmount || !paymentMethod) {
      res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc'
      });
      return;
    }

    // Find car
    const car = mockCars.find(c => c.id === carId);
    if (!car) {
      res.status(404).json({
        success: false,
        message: 'Không tìm thấy xe'
      });
      return;
    }

    // Check availability
    if (car.status !== CarStatus.AVAILABLE) {
      res.status(400).json({
        success: false,
        message: 'Xe hiện không khả dụng'
      });
      return;
    }

    // Calculate rental days
    const pickup = new Date(pickupDate);
    const returnD = new Date(returnDate);
    const rentalDays = Math.max(1, Math.ceil((returnD.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24)));

    // Generate booking number
    const bookingNumber = 'CR' + Date.now().toString();

    // Create booking data
    const bookingData = {
      bookingNumber,
      bookingType: BookingType.CAR_RENTAL,
      status: BookingStatus.PENDING,
      userId: req.user?.id || 'guest',
      serviceId: carId,
      bookingDetails: {
        serviceName: car.fullName,
        description: `Thuê xe ${car.fullName} - ${rentalDays} ngày`,
        duration: `${rentalDays} ngày`,
        startDate: pickupDate,
        endDate: returnDate,
        participants: 1,
        specialRequests,
        contactInfo,
        carDetails: {
          carId,
          make: car.make,
          model: car.model,
          year: car.year,
          licensePlate: car.licensePlate,
          seats: car.seats,
          transmission: car.transmission,
          pricePerDay: car.pricePerDay
        },
        rentalDetails: {
          pickupDate,
          returnDate,
          pickupLocation: pickupLocation || car.location.address,
          returnLocation: returnLocation || car.location.address,
          rentalDays,
          driverInfo,
          additionalServices: additionalServices || []
        }
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
        },
        momo: {
          partnerCode: 'MOMO_PARTNER_CODE',
          accessKey: 'MOMO_ACCESS_KEY',
          secretKey: 'MOMO_SECRET_KEY',
          endpoint: 'https://test-payment.momo.vn',
          redirectUrl: process.env.MOMO_RETURN_URL || 'http://localhost:3000/payment/return',
          ipnUrl: process.env.MOMO_NOTIFY_URL || 'http://localhost:3001/api/payment/momo/callback'
        },
        zalopay: {
          appId: 'ZALOPAY_APP_ID',
          key1: 'ZALOPAY_KEY1',
          key2: 'ZALOPAY_KEY2',
          endpoint: 'https://sb-openapi.zalopay.vn',
          callbackUrl: process.env.ZALOPAY_CALLBACK_URL || 'http://localhost:3001/api/payment/zalopay/callback'
        },
        onepay: {
          merchantId: 'ONEPAY_MERCHANT_ID',
          accessCode: 'ONEPAY_ACCESS_CODE',
          secureSecret: 'ONEPAY_SECURE_SECRET',
          paymentUrl: 'https://mtf.onepay.vn/onecomm-pay/vpc.op',
          queryUrl: 'https://mtf.onepay.vn/onecomm-pay/Vpcdps.op',
          returnUrl: process.env.ONEPAY_RETURN_URL || 'http://localhost:3000/payment/return'
        }
      });

      // Process payment
      const paymentRequest: PaymentRequest = {
        bookingId: bookingNumber,
        userId: req.user?.id,
        amount: totalAmount,
        currency: 'VND',
        description: `Thanh toan thue xe ${car.fullName}`,
        customerInfo: {
          name: driverInfo.fullName,
          email: driverInfo.email,
          phone: driverInfo.phone
        },
        returnUrl: 'http://localhost:3000/payment/return'
      };

      const paymentResult = await paymentService.createPayment(paymentRequest, paymentMethod as any);

      if (paymentResult.success) {
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
            message: 'Đặt xe và thanh toán thành công',
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
        message: 'Đặt xe thành công (Demo mode)',
        bookingNumber,
        transactionId: 'DEMO_' + Date.now(),
        booking: bookingData
      });
    }
  } catch (error) {
    console.error('Book car error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi đặt xe',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getCarBookings = async (req: AuthRequest, res: Response): Promise<void> => {
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
      message: 'Lịch sử thuê xe - tính năng đang phát triển'
    });
  } catch (error) {
    console.error('Get car bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy lịch sử thuê xe',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const cancelCarBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { bookingId } = req.params;
    const { reason } = req.body;

    // In a real implementation, find and update booking in database
    res.json({
      success: true,
      message: 'Hủy đặt xe thành công',
      bookingId,
      reason
    });
  } catch (error) {
    console.error('Cancel car booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi hủy đặt xe',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
