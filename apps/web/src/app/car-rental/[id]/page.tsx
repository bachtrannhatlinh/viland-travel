import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CarDetails from './components/CarDetails';

interface CarDetailsPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: CarDetailsPageProps): Promise<Metadata> {
  // In real app, fetch car data based on params.id
  return {
    title: `Chi tiết xe - GoSafe`,
    description: 'Xem thông tin chi tiết về xe thuê, tính năng, giá cả và đặt xe ngay.',
  };
}

async function getCarDetails(id: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/car-rental/${id}`, {
      cache: 'no-store' // For dynamic content
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch car details');
    }
    
    const data = await response.json();
    return data.success ? data.data : null;
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
