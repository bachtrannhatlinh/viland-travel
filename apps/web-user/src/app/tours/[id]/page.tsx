import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import TourDetails from './components/TourDetails'
import { apiClient } from '@/lib/utils'

interface TourDetailPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: TourDetailPageProps): Promise<Metadata> {
  // Trong thực tế sẽ fetch data từ API
  return {
    title: `Chi tiết tour - ${params.id} - ViLand Travel`,
    description: 'Xem thông tin chi tiết về chuyến đi, tính năng, giá cả và đặt chuyến đi ngay.',
  };
}

async function getTourDetail(id: string) {
  try {
    let tour = null;
    // Truyền cache: 'no-store' vào fetch options (tham số thứ 3)
    const response = await apiClient.get(`/tours/${id}`, undefined, { cache: 'no-store' });

    if (response.success) {
      tour = response.data;
    } else {
      console.error('Không thể tải danh sách tours');
    }

    return tour;
  } catch (error) {
    console.error('Error fetching tour details:', error);
    return null;
  }
}

export default async function TourDetailPage({ params }: TourDetailPageProps) {
  const tour = await getTourDetail(params.id);

  if (!tour) {
    notFound()
  }

  return <TourDetails tour={tour} />

}
