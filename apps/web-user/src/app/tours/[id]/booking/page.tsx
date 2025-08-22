'use client';

import { notFound } from 'next/navigation'
import TourBookingForm from './components/TourBookingForm'


import { apiClient } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface TourBookingPageProps {
  params: {
    id: string
  }
}

export default function TourBookingPage({ params }: TourBookingPageProps) {
  const [tour, setTour] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get(`/tours/${params.id}`);
        if (res.success && res.data) {
          // Map snake_case -> camelCase và chuẩn hóa dữ liệu cho TourBookingForm
          const raw = res.data;
          const mappedTour = {
            id: raw.id,
            title: raw.title,
            duration: {
              days: raw.duration_days ?? 0,
              nights: raw.duration_nights ?? 0,
            },
            price: {
              adult: raw.price_adult ?? 0,
              child: raw.price_child ?? 0,
              infant: raw.price_infant ?? 0,
              currency: raw.currency ?? 'VND',
            },
            discountPrice: (raw.discount_adult || raw.discount_child || raw.discount_infant) ? {
              adult: raw.discount_adult ?? 0,
              child: raw.discount_child ?? 0,
              infant: raw.discount_infant ?? 0,
            } : undefined,
            availability: Array.isArray(raw.availability) ? raw.availability : [],
            maxGroupSize: raw.max_group_size ?? 15,
            minGroupSize: raw.min_group_size ?? 1,
            // ...bạn có thể map thêm các trường khác nếu cần
          };
          setTour(mappedTour);
        } else {
          setError(res.message || 'Không tìm thấy tour');
        }
      } catch (err: any) {
        setError('Có lỗi xảy ra khi tải tour: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTour();
  }, [params.id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Đang tải thông tin tour...</div>;
  }
  if (error || !tour) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 bg-primary-600 text-white rounded-full text-sm font-semibold">
                1
              </div>
              <span className="ml-2 text-sm font-medium text-primary-600">Chọn tour</span>
            </div>
            <div className="flex-1 h-0.5 bg-primary-600 mx-4"></div>
            <div className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 bg-primary-600 text-white rounded-full text-sm font-semibold">
                2
              </div>
              <span className="ml-2 text-sm font-medium text-primary-600">Đặt tour</span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-300 mx-4"></div>
            <div className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 bg-gray-300 text-gray-600 rounded-full text-sm font-semibold">
                3
              </div>
              <span className="ml-2 text-sm font-medium text-gray-600">Thanh toán</span>
            </div>
          </div>
        </div>

        <TourBookingForm tour={tour} />
      </div>
    </div>
  );
}
