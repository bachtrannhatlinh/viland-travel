import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CarBookingForm from './components/CarBookingForm';

interface CarBookingPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: CarBookingPageProps): Promise<Metadata> {
  return {
    title: `Đặt xe - ViLand Travel`,
    description: 'Hoàn tất đặt xe thuê với thông tin cá nhân và thanh toán an toàn.',
  };
}

// Mock function to get car data - in real app, fetch from API
async function getCarData(id: string) {
  // For demo purposes, return mock data
  return {
    id,
    make: 'Toyota',
    model: 'Vios',
    year: 2023,
    fullName: '2023 Toyota Vios',
    pricePerDay: 800000,
    currency: 'VND',
    seats: 4,
    transmission: 'automatic',
    fuelType: 'gasoline',
    images: ['/images/car-vios-1.jpg'],
    location: {
      city: 'TP. Hồ Chí Minh',
      pickupPoints: [
        {
          id: 'tansonnhat',
          name: 'Sân bay Tân Sơn Nhất',
          address: 'Sân bay Tân Sơn Nhất, Tân Bình',
          available24h: true,
          fee: 0
        },
        {
          id: 'district1',
          name: 'Trung tâm Quận 1',
          address: '123 Đồng Khởi, Quận 1',
          available24h: false,
          fee: 0,
          openHours: '06:00 - 22:00'
        }
      ]
    },
    rentalTerms: {
      minAge: 22,
      maxAge: 70,
      additionalFees: {
        youngDriver: { age: '22-24', fee: 200000, description: 'Phụ phí cho tài xế dưới 25 tuổi' },
        additionalDriver: { fee: 100000, description: 'Phụ phí cho mỗi tài xế phụ' },
        gps: { fee: 50000, description: 'Thiết bị định vị GPS' },
        childSeat: { fee: 100000, description: 'Ghế an toàn cho trẻ em' },
        delivery: { feePerKm: 10000, freeWithinKm: 10, description: 'Giao xe tận nơi' }
      }
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
        description: 'Bảo hiểm toàn diện cho xe và người ngồi trên xe'
      }
    }
  };
}

export default async function CarBookingPage({ params }: CarBookingPageProps) {
  const car = await getCarData(params.id);
  
  if (!car) {
    notFound();
  }

  return <CarBookingForm car={car} />;
}
