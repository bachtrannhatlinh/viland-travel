import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CarDetails from './components/CarDetails';
import { apiClient } from '@/lib/utils';

interface CarDetailsPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: CarDetailsPageProps): Promise<Metadata> {
  // In real app, fetch car data based on params.id
  return {
    title: `Chi tiết xe - ViLand Travel`,
    description: 'Xem thông tin chi tiết về xe thuê, tính năng, giá cả và đặt xe ngay.',
  };
}

async function getCarDetails(id: string) {
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
        coordinates: p?.coordinates || raw?.location?.coordinates || { lat: 10.77, lng: 106.7 },
        available24h: p?.available24h ?? true,
        fee: p?.fee ?? 0,
        openHours: p?.openHours || '08:00-20:00',
      }));
      if (arr.length === 0) {
        arr.push({
          id: 'default',
          name: 'Văn phòng',
          address: raw?.location?.address || 'Trung tâm',
          coordinates: raw?.location?.coordinates || { lat: 10.77, lng: 106.7 },
          available24h: true,
          fee: 0,
          openHours: '08:00-20:00'
        });
      }
      return arr;
    };
    const normalized = {
      id: raw.id,
      make: raw.make,
      model: raw.model,
      year: raw.year,
      type: raw.type || 'economy',
      licensePlate: raw.license_plate || raw.licensePlate || '',
      color: raw.color || 'Trắng',
      seats: raw.seats ?? 4,
      doors: raw.doors ?? 4,
      transmission: raw.transmission || raw.transmission_type || 'automatic',
      fuelType: raw.fuel_type || raw.fuelType || 'gasoline',
      engineSize: raw.engine_size || raw.engineSize || 1.5,
      pricePerDay: raw.price_per_day || raw.pricePerDay || 0,
      deposit: raw.deposit || 0,
      currency: raw.currency || 'VND',
      mileage: raw.mileage || 0,
      rating: raw.rating || 4.6,
      reviewCount: raw.review_count || raw.reviewCount || 0,
      images: toArray(raw.images)?.length ? raw.images : ['/images/car-placeholder.jpg'],
      features: toArray(raw.features)?.length ? raw.features : ['Điều hòa', 'Bluetooth', 'Camera lùi'],
      location: {
        address: raw.location?.address || 'Trung tâm thành phố',
        city: raw.location?.city || 'TP. Hồ Chí Minh',
        country: raw.location?.country || 'Việt Nam',
        coordinates: raw.location?.coordinates || { lat: 10.77, lng: 106.7 },
        pickupPoints: ensurePickupPoints(raw.location?.pickupPoints),
      },
      insurance: {
        basic: {
          included: raw.insurance?.basic?.included ?? true,
          coverage: raw.insurance?.basic?.coverage || 'Bảo hiểm cơ bản',
          description: raw.insurance?.basic?.description || 'Bao gồm trong giá',
        },
        comprehensive: {
          available: raw.insurance?.comprehensive?.available ?? true,
          pricePerDay: raw.insurance?.comprehensive?.pricePerDay || 150000,
          coverage: raw.insurance?.comprehensive?.coverage || 'Bảo hiểm toàn diện',
          description: raw.insurance?.comprehensive?.description || 'Mở rộng phạm vi bảo vệ',
        },
      },
      rentalTerms: {
        minAge: raw.rental_terms?.minAge || raw.rentalTerms?.minAge || 22,
        maxAge: raw.rental_terms?.maxAge || raw.rentalTerms?.maxAge || 70,
        licenseRequired: raw.rental_terms?.licenseRequired || raw.rentalTerms?.licenseRequired || ['B2'],
        drivingExperience: raw.rental_terms?.drivingExperience || 1,
        additionalFees: {
          youngDriver: { age: '22-24', fee: raw.rental_terms?.additionalFees?.youngDriver || 200000, description: 'Áp dụng cho tài xế trẻ' },
          additionalDriver: { fee: raw.rental_terms?.additionalFees?.additionalDriver || 100000, description: 'Phụ phí tài xế phụ' },
          gps: { fee: raw.rental_terms?.additionalFees?.gps || 50000, description: 'Thuê thiết bị GPS' },
          childSeat: { fee: raw.rental_terms?.additionalFees?.childSeat || 100000, description: 'Ghế an toàn trẻ em' },
          delivery: { feePerKm: 10000, freeWithinKm: 5, description: 'Giao nhận xe tận nơi' },
        },
        fuelPolicy: raw.rental_terms?.fuelPolicy || 'Trả xe đầy bình như khi nhận',
        mileageLimit: raw.rental_terms?.mileageLimit || 300,
        lateFee: raw.rental_terms?.lateFee || 100000,
        cleaningFee: 200000,
        smokingPenalty: 1000000,
      },
      reviews: Array.isArray(raw.reviews) ? raw.reviews : [],
      specifications: {
        fuelConsumption: '6.5L/100km',
        maxPower: '107 hp',
        maxTorque: '140 Nm',
        topSpeed: '180 km/h',
        acceleration: '11s',
        trunkCapacity: '500L',
        fuelTankCapacity: '45L',
      },
      policies: {
        cancellation: { free: 24, partial: 12, penalty: 6 },
        modification: { free: 24, fee: 12 },
        damage: { reporting: 'Trong 24h', assessment: 'Trung tâm dịch vụ', liability: 'Theo hợp đồng' },
      },
      fullName: `${raw.year} ${raw.make} ${raw.model}`,
      isBookable: raw.status ? String(raw.status).toLowerCase() === 'available' : true,
      similarCars: Array.isArray(raw.similarCars) ? raw.similarCars : [],
    };
    return normalized;
  } catch (error) {
    console.error('Error fetching car details:', error);
    return null;
  }
}

export default async function CarDetailsPage({ params }: CarDetailsPageProps) {
  const car = await getCarDetails(params.id);
  if (!car) {
    notFound();
  }
  return <CarDetails car={car} />;
}
