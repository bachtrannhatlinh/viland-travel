'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { Typography } from '@/components/ui/typography'
import { Section } from '@/components/ui/section'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { apiClient } from '@/lib/utils';

interface Tour {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  images: string[];
  duration_days: number;
  duration_nights: number;
  destinations: string[];
  price_adult: number;
  price_child: number;
  currency: string;
  discount_adult?: number;
  category: string;
  difficulty: string;
  rating: number;
  total_reviews: number;
  is_featured: boolean;
}

export default function ToursPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        // Gọi Next.js API route thay vì apiClient
        const response = await apiClient.get('/tours/get');

        if (response.success) {
          setTours(response.data.tours);
        } else {
          setError(response.message || 'Không thể tải danh sách tours');
        }
      } catch (err: any) {
        setError('Có lỗi xảy ra khi tải tours: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const renderStars = (rating: number) => {
    return (
      <Section className="flex items-center">
        <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <Typography variant="small" className="text-sm text-gray-600">
          {rating} ({tours.find(t => t.rating === rating)?.total_reviews || 0})
        </Typography>
      </Section>
    );
  };

  if (loading) {
    return (
      <Section className="min-h-screen bg-gray-50">
        <Section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Section className="text-center">
            <Typography variant="h1" className="text-4xl font-bold text-gray-900 mb-4">
              Tour du lịch
            </Typography>
            <Typography variant="large" className="text-xl text-gray-600 mb-8">
              Đang tải danh sách tours...
            </Typography>
          </Section>
        </Section>
      </Section>
    );
  }

  if (error) {
    return (
      <Section className="min-h-screen bg-gray-50">
        <Section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Section className="text-center">
            <Typography variant="h1" className="text-4xl font-bold text-gray-900 mb-4">
              Tour du lịch
            </Typography>
            <Typography variant="large" className="text-xl text-red-600 mb-8">
              {error}
            </Typography>
            <Button onClick={() => window.location.reload()}>
              Thử lại
            </Button>
          </Section>
        </Section>
      </Section>
    );
  }

  return (
    <Section className="min-h-screen bg-gray-50">
      <Section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <Section className="text-center mb-12">
          <Typography variant="h1" className="text-4xl font-bold text-gray-900 mb-4">
            Tour du lịch
          </Typography>
          <Typography variant="large" className="text-xl text-gray-600">
            Khám phá những điểm đến tuyệt vời cùng ViLand Travel
          </Typography>
        </Section>

        {/* Tours Grid */}
        <Section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {tours.map((tour) => {
            const currentPrice = tour.discount_adult || tour.price_adult;
            const hasDiscount = tour.discount_adult && tour.discount_adult < tour.price_adult;

            return (
              <Card key={tour.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <Section className="h-48 bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center">
                  <Typography variant="large" className="text-white text-xl font-bold">
                    {tour.destinations[0] || 'Tour'}
                  </Typography>
                </Section>
                <CardContent className="p-6">
                  <Section className="flex items-center justify-between mb-2">
                    <Badge 
                      variant={tour.is_featured ? "default" : "secondary"} 
                      className={`text-xs font-medium px-2 py-1 rounded ${
                        tour.is_featured 
                          ? "bg-orange-100 text-orange-800" 
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {tour.is_featured ? 'Nổi bật' : tour.category}
                    </Badge>
                    {renderStars(tour.rating)}
                  </Section>
                  
                  <Typography variant="h3" className="text-xl font-semibold text-gray-900 mb-2">
                    {tour.title}
                  </Typography>
                  
                  <Typography variant="p" className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {tour.short_description}
                  </Typography>
                  
                  <Section className="flex items-center justify-between mb-4">
                    <Section className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      <Typography variant="small">
                        {tour.duration_days} ngày {tour.duration_nights} đêm
                      </Typography>
                    </Section>
                    <Section className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <Typography variant="small">{tour.destinations.join(', ')}</Typography>
                    </Section>
                  </Section>
                  
                  <Section className="flex items-center justify-between">
                    <Section>
                      <Typography variant="large" className="text-2xl font-bold text-primary-600">
                        {formatPrice(currentPrice)}
                      </Typography>
                      {hasDiscount && (
                        <Typography variant="small" className="text-sm text-gray-500 line-through ml-2">
                          {formatPrice(tour.price_adult)}
                        </Typography>
                      )}
                    </Section>
                    <Link href={`/tours/${tour.id}`}>
                      <Button variant="outline" size="sm">
                        Xem chi tiết
                      </Button>
                    </Link>
                  </Section>
                </CardContent>
              </Card>
            );
          })}
        </Section>

        {tours.length === 0 && !loading && (
          <Section className="text-center py-12">
            <Typography variant="large" className="text-gray-500 mb-4">
              Chưa có tour nào được tạo
            </Typography>
          </Section>
        )}

        {/* Coming Soon Section */}
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardContent className="text-center py-16">
            <Typography variant="h2" className="text-3xl font-bold mb-4">
              Sắp có thêm nhiều tour hấp dẫn
            </Typography>
            <Typography variant="p" className="text-gray-100 mb-8 max-w-md mx-auto">
              Chúng tôi đang cập nhật thêm nhiều tour du lịch mới nhất và hấp dẫn nhất. 
              Đăng ký nhận thông báo để không bỏ lỡ các ưu đãi đặc biệt.
            </Typography>
            <Section className="space-x-4">
              <Button className="bg-white text-blue-600 hover:bg-gray-100">
                Đăng ký nhận tin
              </Button>
              <Button className="bg-white text-blue-600 hover:bg-gray-100">
                Liên hệ tư vấn
              </Button>
            </Section>
          </CardContent>
        </Card>
      </Section>
    </Section>
  )
}
