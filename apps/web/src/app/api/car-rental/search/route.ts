import { NextRequest, NextResponse } from 'next/server';

// Mock data for car rental search
const mockCarResults = [
  {
    id: '1',
    make: 'Toyota',
    model: 'Vios',
    year: 2023,
    type: 'economy',
    seats: 4,
    transmission: 'automatic',
    fuelType: 'gasoline',
    pricePerDay: 800000,
    deposit: 3000000,
    currency: 'VND',
    images: ['/images/car-vios-1.jpg', '/images/car-vios-2.jpg'],
    features: ['Điều hòa', 'Bluetooth', 'Camera lùi', 'Cảm biến lùi'],
    rating: 4.5,
    reviewCount: 128,
    location: {
      address: '123 Nguyễn Văn Linh, Quận 7',
      city: 'TP. Hồ Chí Minh',
      pickupPoints: [
        {
          name: 'Sân bay Tân Sơn Nhất',
          address: 'Sân bay Tân Sơn Nhất, Tân Bình'
        },
        {
          name: 'Trung tâm Quận 1',
          address: '123 Đồng Khởi, Quận 1'
        }
      ]
    },
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
      mileageLimit: 300
    }
  },
  {
    id: '2',
    make: 'Honda',
    model: 'City',
    year: 2023,
    type: 'compact',
    seats: 5,
    transmission: 'automatic',
    fuelType: 'gasoline',
    pricePerDay: 850000,
    deposit: 3000000,
    currency: 'VND',
    images: ['/images/car-city-1.jpg', '/images/car-city-2.jpg'],
    features: ['Điều hòa', 'Bluetooth', 'Camera lùi', 'Màn hình cảm ứng'],
    rating: 4.7,
    reviewCount: 95,
    location: {
      address: '456 Võ Văn Tần, Quận 3',
      city: 'TP. Hồ Chí Minh',
      pickupPoints: [
        {
          name: 'Sân bay Tân Sơn Nhất',
          address: 'Sân bay Tân Sơn Nhất, Tân Bình'
        }
      ]
    },
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
      mileageLimit: 300
    }
  },
  {
    id: '3',
    make: 'Toyota',
    model: 'Innova',
    year: 2023,
    type: 'minivan',
    seats: 7,
    transmission: 'automatic',
    fuelType: 'gasoline',
    pricePerDay: 1200000,
    deposit: 5000000,
    currency: 'VND',
    images: ['/images/car-innova-1.jpg', '/images/car-innova-2.jpg'],
    features: ['Điều hòa', 'Bluetooth', 'Camera lùi', '7 chỗ ngồi', 'Cốp rộng'],
    rating: 4.6,
    reviewCount: 72,
    location: {
      address: '789 Lê Văn Sỹ, Quận Phú Nhuận',
      city: 'TP. Hồ Chí Minh',
      pickupPoints: [
        {
          name: 'Sân bay Tân Sơn Nhất',
          address: 'Sân bay Tân Sơn Nhất, Tân Bình'
        },
        {
          name: 'Bến xe Miền Đông',
          address: 'Bến xe Miền Đông, Bình Thạnh'
        }
      ]
    },
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
      mileageLimit: 250
    }
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    const pickupDate = searchParams.get('pickupDate');
    const returnDate = searchParams.get('returnDate');
    const carType = searchParams.get('carType');
    const seats = searchParams.get('seats');
    const priceMin = searchParams.get('priceMin');
    const priceMax = searchParams.get('priceMax');

    // Filter cars based on search criteria
    let filteredCars = [...mockCarResults];

    if (location) {
      filteredCars = filteredCars.filter(car => 
        car.location.city.toLowerCase().includes(location.toLowerCase()) ||
        car.location.address.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (carType && carType !== 'all') {
      filteredCars = filteredCars.filter(car => car.type === carType);
    }

    if (seats) {
      filteredCars = filteredCars.filter(car => car.seats >= parseInt(seats));
    }

    if (priceMin) {
      filteredCars = filteredCars.filter(car => car.pricePerDay >= parseFloat(priceMin));
    }

    if (priceMax) {
      filteredCars = filteredCars.filter(car => car.pricePerDay <= parseFloat(priceMax));
    }

    // Calculate rental days if dates provided
    let rentalDays = 1;
    if (pickupDate && returnDate) {
      const pickup = new Date(pickupDate);
      const returnD = new Date(returnDate);
      rentalDays = Math.max(1, Math.ceil((returnD.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24)));
    }

    // Add calculated fields
    const enrichedCars = filteredCars.map(car => ({
      ...car,
      totalPrice: car.pricePerDay * rentalDays,
      rentalDays,
      fullName: `${car.year} ${car.make} ${car.model}`,
      isAvailable: true
    }));

    return NextResponse.json({
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
        rentalDays
      },
      totalResults: enrichedCars.length
    });
  } catch (error) {
    console.error('Car search error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Lỗi khi tìm kiếm xe',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
