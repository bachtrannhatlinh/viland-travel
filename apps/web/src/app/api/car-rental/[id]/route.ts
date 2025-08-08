import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const carId = params.id;

    // Mock car data - in real app, fetch from database
    const mockCar = {
      id: carId,
      make: 'Toyota',
      model: 'Vios',
      year: 2023,
      type: 'economy',
      licensePlate: '51F-12345',
      color: 'Trắng',
      seats: 4,
      doors: 4,
      transmission: 'automatic',
      fuelType: 'gasoline',
      engineSize: 1.5,
      pricePerDay: 800000,
      deposit: 3000000,
      currency: 'VND',
      mileage: 15000,
      rating: 4.5,
      reviewCount: 128,
      images: [
        '/images/car-vios-1.jpg',
        '/images/car-vios-2.jpg',
        '/images/car-vios-3.jpg',
        '/images/car-vios-4.jpg'
      ],
      features: [
        'Điều hòa tự động',
        'Bluetooth kết nối',
        'Camera lùi',
        'Cảm biến lùi',
        'Hệ thống định vị GPS',
        'USB charging ports',
        'Túi khí an toàn',
        'ABS brake system'
      ],
      location: {
        address: '123 Nguyễn Văn Linh, Quận 7',
        city: 'TP. Hồ Chí Minh',
        country: 'Việt Nam',
        coordinates: { lat: 10.7411, lng: 106.7097 },
        pickupPoints: [
          {
            id: 'tansonnhat',
            name: 'Sân bay Tân Sơn Nhất',
            address: 'Sân bay Tân Sơn Nhất, Tân Bình',
            coordinates: { lat: 10.8187, lng: 106.6521 },
            available24h: true,
            fee: 0
          },
          {
            id: 'district1',
            name: 'Trung tâm Quận 1',
            address: '123 Đồng Khởi, Quận 1',
            coordinates: { lat: 10.7769, lng: 106.7009 },
            available24h: false,
            fee: 0,
            openHours: '06:00 - 22:00'
          },
          {
            id: 'district7',
            name: 'Văn phòng Quận 7',
            address: '123 Nguyễn Văn Linh, Quận 7',
            coordinates: { lat: 10.7411, lng: 106.7097 },
            available24h: false,
            fee: 0,
            openHours: '08:00 - 20:00'
          }
        ]
      },
      insurance: {
        basic: {
          included: true,
          coverage: 'Bảo hiểm cơ bản (100 triệu VNĐ)',
          description: 'Bao gồm bảo hiểm bắt buộc dân sự và bảo hiểm xe cơ bản'
        },
        comprehensive: {
          available: true,
          pricePerDay: 150000,
          coverage: 'Bảo hiểm toàn diện (500 triệu VNĐ)',
          description: 'Bảo hiểm toàn diện cho xe và người ngồi trên xe, miễn giảm tối đa rủi ro'
        }
      },
      rentalTerms: {
        minAge: 22,
        maxAge: 70,
        licenseRequired: ['B2', 'B1'],
        drivingExperience: 2, // years
        additionalFees: {
          youngDriver: {
            age: '22-24',
            fee: 200000,
            description: 'Phụ phí cho tài xế dưới 25 tuổi'
          },
          additionalDriver: {
            fee: 100000,
            description: 'Phụ phí cho mỗi tài xế phụ'
          },
          gps: {
            fee: 50000,
            description: 'Thiết bị định vị GPS'
          },
          childSeat: {
            fee: 100000,
            description: 'Ghế an toàn cho trẻ em'
          },
          delivery: {
            feePerKm: 10000,
            freeWithinKm: 10,
            description: 'Giao xe tận nơi'
          }
        },
        fuelPolicy: 'Trả xe đầy bình như khi nhận',
        mileageLimit: 300, // km per day
        lateFee: 100000, // per hour
        cleaningFee: 500000, // if returned dirty
        smokingPenalty: 2000000
      },
      availability: {
        calendar: [], // Will be populated based on actual bookings
        minRentalDays: 1,
        maxRentalDays: 30,
        advanceBookingDays: 365
      },
      reviews: [
        {
          id: '1',
          userId: 'user1',
          userName: 'Nguyễn Văn A',
          rating: 5,
          comment: 'Xe rất sạch sẽ, chạy êm. Dịch vụ hỗ trợ tốt.',
          date: '2024-01-15',
          verified: true
        },
        {
          id: '2',
          userId: 'user2', 
          userName: 'Trần Thị B',
          rating: 4,
          comment: 'Xe đẹp, giá hợp lý. Sẽ thuê lại lần sau.',
          date: '2024-01-10',
          verified: true
        }
      ],
      specifications: {
        fuelConsumption: '5.2L/100km',
        maxPower: '107 HP',
        maxTorque: '140 Nm',
        topSpeed: '175 km/h',
        acceleration: '11.5s (0-100km/h)',
        trunkCapacity: '506L',
        fuelTankCapacity: '42L'
      },
      policies: {
        cancellation: {
          free: 24, // hours before pickup
          partial: 12, // hours before pickup  
          penalty: 50 // percentage of total amount
        },
        modification: {
          free: 24, // hours before pickup
          fee: 100000 // VND
        },
        damage: {
          reporting: 'Phải báo ngay cho công ty trong vòng 2 giờ',
          assessment: 'Sẽ được đánh giá bởi chuyên gia bảo hiểm',
          liability: 'Theo quy định bảo hiểm'
        }
      }
    };

    // Add similar cars
    const similarCars = [
      {
        id: '2',
        make: 'Honda',
        model: 'City',
        year: 2023,
        pricePerDay: 850000,
        rating: 4.7,
        images: ['/images/car-city-1.jpg']
      },
      {
        id: '4',
        make: 'Hyundai',
        model: 'Accent',
        year: 2023,
        pricePerDay: 820000,
        rating: 4.4,
        images: ['/images/car-accent-1.jpg']
      }
    ];

    const enrichedCar = {
      ...mockCar,
      fullName: `${mockCar.year} ${mockCar.make} ${mockCar.model}`,
      isBookable: true,
      similarCars
    };

    return NextResponse.json({
      success: true,
      data: enrichedCar
    });
  } catch (error) {
    console.error('Get car details error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Lỗi khi lấy thông tin xe',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
