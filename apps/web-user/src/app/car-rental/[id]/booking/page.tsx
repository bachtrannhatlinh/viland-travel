import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import CarBookingForm from './components/CarBookingForm';
import { apiClient } from '@/lib/utils';

interface CarBookingPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: CarBookingPageProps): Promise<Metadata> {
  return {
    title: `Đặt xe - ViLand Travel`,
    description: 'Hoàn tất đặt xe thuê với thông tin cá nhân và thanh toán an toàn.',
  };
}

async function getCarData(id: string) {
  try {
    const data = await apiClient.get(`/car-rental/${id}`, undefined, { cache: 'no-store' });
    if (!data?.success || !data.data) return null;
    const raw = data.data;
    const toArray = (v: any) => (Array.isArray(v) ? v : []);
    const ensurePickupPoints = (pts: any[]) => {
      const arr = toArray(pts).map((p: any, idx: number) => ({
        id: p?.id || `${idx}`,
        name: p?.name || `Điểm ${idx + 1}`,
        address: p?.address || raw?.location?.address || 'Địa điểm nhận xe',
        available24h: p?.available24h ?? true,
        fee: p?.fee ?? 0,
        openHours: p?.openHours || '08:00-20:00',
      }));
      if (arr.length === 0) {
        arr.push({ id: 'default', name: 'Văn phòng', address: raw?.location?.address || 'Trung tâm', available24h: true, fee: 0, openHours: '08:00-20:00' });
      }
      return arr;
    };
    const normalized = {
      id: raw.id,
      make: raw.make,
      model: raw.model,
      year: raw.year,
      fullName: `${raw.year} ${raw.make} ${raw.model}`,
      pricePerDay: raw.price_per_day || raw.pricePerDay || 0,
      currency: raw.currency || 'VND',
      seats: raw.seats ?? 4,
      transmission: raw.transmission || raw.transmission_type || 'automatic',
      fuelType: raw.fuel_type || raw.fuelType || 'gasoline',
      images: toArray(raw.images)?.length ? raw.images : ['/images/car-placeholder.jpg'],
      location: {
        city: raw.location?.city || 'TP. Hồ Chí Minh',
        pickupPoints: ensurePickupPoints(raw.location?.pickupPoints),
      },
      rentalTerms: {
        minAge: raw.rental_terms?.minAge ?? 22,
        maxAge: raw.rental_terms?.maxAge ?? 65,
        additionalFees: {
          youngDriver: { age: '22-24', fee: raw.rental_terms?.additionalFees?.youngDriver || 200000, description: 'Áp dụng cho tài xế trẻ' },
          additionalDriver: { fee: raw.rental_terms?.additionalFees?.additionalDriver || 100000, description: 'Phụ phí tài xế phụ' },
          gps: { fee: raw.rental_terms?.additionalFees?.gps || 50000, description: 'Thuê thiết bị GPS' },
          childSeat: { fee: raw.rental_terms?.additionalFees?.childSeat || 100000, description: 'Ghế an toàn trẻ em' },
          delivery: { feePerKm: 10000, freeWithinKm: 5, description: 'Giao nhận xe tận nơi' },
        },
      },
      insurance: {
        basic: {
          included: true,
          coverage: 'Bảo hiểm cơ bản',
          description: 'Bảo hiểm trách nhiệm dân sự bắt buộc',
        },
        comprehensive: {
          available: true,
          pricePerDay: raw.insurance?.comprehensive?.pricePerDay || 150000,
          coverage: 'Bảo hiểm toàn diện',
          description: 'Mở rộng phạm vi bảo vệ',
        },
      },
    };
    return normalized;
  } catch (error) {
    console.error('Error fetching car details:', error);
    return null;
  }
}

export default async function CarBookingPage({ params }: CarBookingPageProps) {
  const car = await getCarData(params.id);
  if (!car) {
    redirect(`/car-rental/${params.id}`);
  }
  return <CarBookingForm car={car} />;
}
