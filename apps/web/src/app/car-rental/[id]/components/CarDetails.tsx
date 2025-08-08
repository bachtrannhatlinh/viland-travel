'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { Badge } from '@/components/ui/badge';

interface CarDetailsProps {
  car: {
    id: string;
    make: string;
    model: string;
    year: number;
    type: string;
    licensePlate: string;
    color: string;
    seats: number;
    doors: number;
    transmission: string;
    fuelType: string;
    engineSize: number;
    pricePerDay: number;
    deposit: number;
    currency: string;
    mileage: number;
    rating: number;
    reviewCount: number;
    images: string[];
    features: string[];
    location: {
      address: string;
      city: string;
      country: string;
      coordinates: { lat: number; lng: number };
      pickupPoints: Array<{
        id: string;
        name: string;
        address: string;
        coordinates: { lat: number; lng: number };
        available24h: boolean;
        fee: number;
        openHours?: string;
      }>;
    };
    insurance: {
      basic: {
        included: boolean;
        coverage: string;
        description: string;
      };
      comprehensive: {
        available: boolean;
        pricePerDay: number;
        coverage: string;
        description: string;
      };
    };
    rentalTerms: {
      minAge: number;
      maxAge: number;
      licenseRequired: string[];
      drivingExperience: number;
      additionalFees: {
        youngDriver: { age: string; fee: number; description: string };
        additionalDriver: { fee: number; description: string };
        gps: { fee: number; description: string };
        childSeat: { fee: number; description: string };
        delivery: { feePerKm: number; freeWithinKm: number; description: string };
      };
      fuelPolicy: string;
      mileageLimit: number;
      lateFee: number;
      cleaningFee: number;
      smokingPenalty: number;
    };
    reviews: Array<{
      id: string;
      userId: string;
      userName: string;
      rating: number;
      comment: string;
      date: string;
      verified: boolean;
    }>;
    specifications: {
      fuelConsumption: string;
      maxPower: string;
      maxTorque: string;
      topSpeed: string;
      acceleration: string;
      trunkCapacity: string;
      fuelTankCapacity: string;
    };
    policies: {
      cancellation: {
        free: number;
        partial: number;
        penalty: number;
      };
      modification: {
        free: number;
        fee: number;
      };
      damage: {
        reporting: string;
        assessment: string;
        liability: string;
      };
    };
    fullName: string;
    isBookable: boolean;
    similarCars: Array<{
      id: string;
      make: string;
      model: string;
      year: number;
      pricePerDay: number;
      rating: number;
      images: string[];
    }>;
  };
}

export default function CarDetails({ car }: CarDetailsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const handleBookNow = () => {
    const params = new URLSearchParams();
    if (searchParams.get('pickupDate')) {
      params.set('pickupDate', searchParams.get('pickupDate')!);
    }
    if (searchParams.get('returnDate')) {
      params.set('returnDate', searchParams.get('returnDate')!);
    }
    if (searchParams.get('pickupLocation')) {
      params.set('pickupLocation', searchParams.get('pickupLocation')!);
    }
    
    router.push(`/car-rental/${car.id}/booking?${params}`);
  };

  const tabs = [
    { id: 'overview', name: 'Tổng quan', icon: '🚗' },
    { id: 'features', name: 'Tính năng', icon: '⭐' },
    { id: 'insurance', name: 'Bảo hiểm', icon: '🛡️' },
    { id: 'terms', name: 'Điều khoản', icon: '📋' },
    { id: 'reviews', name: 'Đánh giá', icon: '💬' },
  ];

  return (
    <section className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <Button variant="ghost" onClick={() => router.push('/car-rental')} className="hover:text-primary-600 p-0 h-auto">
            Thuê xe
          </Button>
          <Typography variant="muted">/</Typography>
          <Typography variant="muted" className="text-gray-900">{car.fullName}</Typography>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Car Images */}
            <Card className="overflow-hidden mb-6">
              <div className="relative">
                <div className="aspect-video relative">
                  <Image
                    src={car.images[selectedImageIndex] || '/images/car-placeholder.jpg'}
                    alt={car.fullName}
                    fill
                    className="object-cover"
                  />
                  
                  {/* Image Navigation */}
                  {car.images.length > 1 && (
                    <>
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => setSelectedImageIndex(prev => 
                          prev === 0 ? car.images.length - 1 : prev - 1
                        )}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white hover:bg-opacity-75"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => setSelectedImageIndex(prev => 
                          prev === car.images.length - 1 ? 0 : prev + 1
                        )}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white hover:bg-opacity-75"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Button>
                    </>
                  )}
                </div>
                
                {/* Thumbnail Images */}
                {car.images.length > 1 && (
                  <div className="flex space-x-2 p-4 overflow-x-auto">
                    {car.images.map((image, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        onClick={() => setSelectedImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 p-0 ${
                          selectedImageIndex === index ? 'border-primary-500' : 'border-gray-200'
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`${car.fullName} ${index + 1}`}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            {/* Car Info Tabs */}
            <Card>
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {tabs.map((tab) => (
                    <Button
                      key={tab.id}
                      variant="ghost"
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm rounded-none ${
                        activeTab === tab.id
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Typography variant="small" className="mr-2">{tab.icon}</Typography>
                      {tab.name}
                    </Button>
                  ))}
                </nav>
              </div>

              <CardContent className="p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <Typography variant="h5" className="text-gray-900 mb-4">Thông số kỹ thuật</Typography>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <Card className="bg-gray-50 p-4">
                          <Typography variant="muted" className="text-sm">Số chỗ</Typography>
                          <Typography variant="small" className="font-semibold">{car.seats} chỗ</Typography>
                        </Card>
                        <Card className="bg-gray-50 p-4">
                          <Typography variant="muted" className="text-sm">Hộp số</Typography>
                          <Typography variant="small" className="font-semibold">
                            {car.transmission === 'automatic' ? 'Tự động' : 'Số sàn'}
                          </Typography>
                        </Card>
                        <Card className="bg-gray-50 p-4">
                          <Typography variant="muted" className="text-sm">Nhiên liệu</Typography>
                          <Typography variant="small" className="font-semibold">
                            {car.fuelType === 'gasoline' ? 'Xăng' : 
                             car.fuelType === 'diesel' ? 'Dầu' : 
                             car.fuelType === 'hybrid' ? 'Hybrid' : 'Điện'}
                          </Typography>
                        </Card>
                        <Card className="bg-gray-50 p-4">
                          <Typography variant="muted" className="text-sm">Dung tích động cơ</Typography>
                          <Typography variant="small" className="font-semibold">{car.engineSize}L</Typography>
                        </Card>
                        <Card className="bg-gray-50 p-4">
                          <Typography variant="muted" className="text-sm">Năm sản xuất</Typography>
                          <Typography variant="small" className="font-semibold">{car.year}</Typography>
                        </Card>
                        <Card className="bg-gray-50 p-4">
                          <Typography variant="muted" className="text-sm">Màu sắc</Typography>
                          <Typography variant="small" className="font-semibold">{car.color}</Typography>
                        </Card>
                      </div>
                    </div>

                    <div>
                      <Typography variant="h5" className="text-gray-900 mb-4">Hiệu suất</Typography>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <Card className="bg-gray-50 p-4">
                          <Typography variant="muted" className="text-sm">Tiêu thụ nhiên liệu</Typography>
                          <Typography variant="small" className="font-semibold">{car.specifications.fuelConsumption}</Typography>
                        </Card>
                        <Card className="bg-gray-50 p-4">
                          <Typography variant="muted" className="text-sm">Công suất tối đa</Typography>
                          <Typography variant="small" className="font-semibold">{car.specifications.maxPower}</Typography>
                        </Card>
                        <Card className="bg-gray-50 p-4">
                          <Typography variant="muted" className="text-sm">Mô-men xoắn</Typography>
                          <Typography variant="small" className="font-semibold">{car.specifications.maxTorque}</Typography>
                        </Card>
                        <Card className="bg-gray-50 p-4">
                          <Typography variant="muted" className="text-sm">Tốc độ tối đa</Typography>
                          <Typography variant="small" className="font-semibold">{car.specifications.topSpeed}</Typography>
                        </Card>
                        <Card className="bg-gray-50 p-4">
                          <Typography variant="muted" className="text-sm">Tăng tốc 0-100km/h</Typography>
                          <Typography variant="small" className="font-semibold">{car.specifications.acceleration}</Typography>
                        </Card>
                        <Card className="bg-gray-50 p-4">
                          <Typography variant="muted" className="text-sm">Thể tích cốp</Typography>
                          <Typography variant="small" className="font-semibold">{car.specifications.trunkCapacity}</Typography>
                        </Card>
                      </div>
                    </div>
                  </div>
                )}

                {/* Features Tab */}
                {activeTab === 'features' && (
                  <div>
                    <Typography variant="h5" className="text-gray-900 mb-4">Tính năng và tiện nghi</Typography>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {car.features.map((feature, index) => (
                        <Card key={index} className="flex items-center p-3 bg-gray-50">
                          <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <Typography variant="small" className="font-medium text-gray-900">{feature}</Typography>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Insurance Tab */}
                {activeTab === 'insurance' && (
                  <div className="space-y-6">
                    <div>
                      <Typography variant="h5" className="text-gray-900 mb-4">Gói bảo hiểm</Typography>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Basic Insurance */}
                        <Card className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <Typography variant="h6" className="text-gray-900">Bảo hiểm cơ bản</Typography>
                            <Typography variant="p" className="text-green-600 font-semibold">Miễn phí</Typography>
                          </div>
                          <Typography variant="small" className="text-gray-600 mb-4">{car.insurance.basic.description}</Typography>
                          <div className="bg-green-50 p-3 rounded-lg">
                            <Typography variant="small" className="font-medium text-green-800">{car.insurance.basic.coverage}</Typography>
                          </div>
                        </Card>

                        {/* Comprehensive Insurance */}
                        <Card className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <Typography variant="h6" className="text-gray-900">Bảo hiểm toàn diện</Typography>
                            <Typography variant="p" className="text-primary-600 font-semibold">
                              {formatPrice(car.insurance.comprehensive.pricePerDay)}/ngày
                            </Typography>
                          </div>
                          <Typography variant="small" className="text-gray-600 mb-4">{car.insurance.comprehensive.description}</Typography>
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <Typography variant="small" className="font-medium text-blue-800">{car.insurance.comprehensive.coverage}</Typography>
                          </div>
                        </Card>
                      </div>
                    </div>
                  </div>
                )}

                {/* Terms Tab */}
                {activeTab === 'terms' && (
                  <div className="space-y-6">
                    <div>
                      <Typography variant="h5" className="text-gray-900 mb-4">Điều khoản thuê xe</Typography>
                      
                      <div className="space-y-4">
                        <Card className="bg-gray-50 p-4">
                          <Typography variant="h6" className="text-gray-900 mb-2">Yêu cầu tài xế</Typography>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Tuổi: {car.rentalTerms.minAge} - {car.rentalTerms.maxAge} tuổi</li>
                            <li>• Kinh nghiệm lái xe: tối thiểu {car.rentalTerms.drivingExperience} năm</li>
                            <li>• Bằng lái: {car.rentalTerms.licenseRequired.join(', ')}</li>
                          </ul>
                        </Card>

                        <Card className="bg-gray-50 p-4">
                          <Typography variant="h6" className="text-gray-900 mb-2">Chính sách nhiên liệu</Typography>
                          <Typography variant="small" className="text-gray-600">{car.rentalTerms.fuelPolicy}</Typography>
                        </Card>

                        <Card className="bg-gray-50 p-4">
                          <Typography variant="h6" className="text-gray-900 mb-2">Giới hạn km/ngày</Typography>
                          <Typography variant="small" className="text-gray-600">{car.rentalTerms.mileageLimit} km/ngày</Typography>
                        </Card>

                        <Card className="bg-gray-50 p-4">
                          <Typography variant="h6" className="text-gray-900 mb-2">Phí phụ thu</Typography>
                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex justify-between">
                              <Typography variant="small">Tài xế trẻ ({car.rentalTerms.additionalFees.youngDriver.age} tuổi):</Typography>
                              <Typography variant="small">{formatPrice(car.rentalTerms.additionalFees.youngDriver.fee)}</Typography>
                            </div>
                            <div className="flex justify-between">
                              <Typography variant="small">Tài xế phụ:</Typography>
                              <Typography variant="small">{formatPrice(car.rentalTerms.additionalFees.additionalDriver.fee)}</Typography>
                            </div>
                            <div className="flex justify-between">
                              <Typography variant="small">Thiết bị GPS:</Typography>
                              <Typography variant="small">{formatPrice(car.rentalTerms.additionalFees.gps.fee)}</Typography>
                            </div>
                            <div className="flex justify-between">
                              <Typography variant="small">Ghế trẻ em:</Typography>
                              <Typography variant="small">{formatPrice(car.rentalTerms.additionalFees.childSeat.fee)}</Typography>
                            </div>
                            <div className="flex justify-between">
                              <Typography variant="small">Trả xe muộn (mỗi giờ):</Typography>
                              <Typography variant="small">{formatPrice(car.rentalTerms.lateFee)}</Typography>
                            </div>
                          </div>
                        </Card>

                        <Card className="bg-red-50 p-4">
                          <Typography variant="h6" className="text-red-900 mb-2">Phí phạt</Typography>
                          <div className="space-y-1 text-sm text-red-800">
                            <div className="flex justify-between">
                              <Typography variant="small">Trả xe không sạch:</Typography>
                              <Typography variant="small">{formatPrice(car.rentalTerms.cleaningFee)}</Typography>
                            </div>
                            <div className="flex justify-between">
                              <Typography variant="small">Hút thuốc trong xe:</Typography>
                              <Typography variant="small">{formatPrice(car.rentalTerms.smokingPenalty)}</Typography>
                            </div>
                          </div>
                        </Card>
                      </div>
                    </div>
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <Typography variant="h5" className="text-gray-900">Đánh giá từ khách hàng</Typography>
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <Typography variant="large" className="font-bold text-gray-900">{car.rating}</Typography>
                        <Typography variant="muted" className="ml-2">({car.reviewCount} đánh giá)</Typography>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {car.reviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-200 pb-6">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                <Typography variant="small" className="text-primary-600 font-semibold">
                                  {review.userName.charAt(0).toUpperCase()}
                                </Typography>
                              </div>
                              <div className="ml-3">
                                <Typography variant="p" className="font-medium text-gray-900">{review.userName}</Typography>
                                <Typography variant="small" className="text-gray-500">{formatDate(review.date)}</Typography>
                              </div>
                            </div>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                                  }`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                              {review.verified && (
                                <Badge className="ml-2 bg-green-100 text-green-800">
                                  Đã xác thực
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Typography variant="p" className="text-gray-700">{review.comment}</Typography>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Booking Card */}
            <Card className="p-6 sticky top-4">
              <CardContent className="text-center mb-6 p-0">
                <Typography variant="h2" className="text-gray-900 mb-2">{car.fullName}</Typography>
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <Typography variant="large" className="font-bold text-gray-900">{car.rating}</Typography>
                  <Typography variant="muted" className="ml-2">({car.reviewCount} đánh giá)</Typography>
                </div>
              </CardContent>

              <div className="text-center mb-6">
                <Typography variant="h1" className="text-3xl font-bold text-primary-600 mb-2">
                  {formatPrice(car.pricePerDay)}
                </Typography>
                <Typography variant="muted">mỗi ngày</Typography>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <Typography variant="muted">Tiền đặt cọc:</Typography>
                  <Typography variant="small" className="font-semibold">{formatPrice(car.deposit)}</Typography>
                </div>
                <div className="flex justify-between text-sm">
                  <Typography variant="muted">Địa điểm:</Typography>
                  <Typography variant="small" className="font-semibold">{car.location.city}</Typography>
                </div>
                <div className="flex justify-between text-sm">
                  <Typography variant="muted">Số km giới hạn:</Typography>
                  <Typography variant="small" className="font-semibold">{car.rentalTerms.mileageLimit} km/ngày</Typography>
                </div>
              </div>

              <Button 
                onClick={handleBookNow}
                className="w-full py-3 text-lg font-semibold"
                size="lg"
              >
                Đặt xe ngay
              </Button>

              <div className="mt-4 text-center">
                <Typography variant="muted" className="text-xs">
                  Miễn phí hủy trong 24h • Xác nhận ngay lập tức
                </Typography>
              </div>
            </Card>

            {/* Pickup Points */}
            <Card className="p-6 mt-6">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="text-lg">Điểm nhận xe</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-3">
                  {car.location.pickupPoints.map((point) => (
                    <Card key={point.id} className="p-3">
                      <Typography variant="small" className="font-medium text-gray-900">{point.name}</Typography>
                      <Typography variant="muted" className="text-sm">{point.address}</Typography>
                      <div className="flex items-center justify-between mt-2">
                        <Badge 
                          variant={point.available24h ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {point.available24h ? '24/7' : point.openHours}
                        </Badge>
                        {point.fee === 0 && (
                          <Badge variant="outline" className="text-xs">
                            Miễn phí
                          </Badge>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Similar Cars */}
        {car.similarCars && car.similarCars.length > 0 && (
          <div className="mt-12">
            <Typography variant="h2" className="text-gray-900 mb-6">Xe tương tự</Typography>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {car.similarCars.map((similarCar) => (
                <Card key={similarCar.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video relative">
                    <Image
                      src={similarCar.images[0] || '/images/car-placeholder.jpg'}
                      alt={`${similarCar.year} ${similarCar.make} ${similarCar.model}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <Typography variant="h6" className="text-gray-900 mb-2">
                      {similarCar.year} {similarCar.make} {similarCar.model}
                    </Typography>
                    <div className="flex items-center justify-between">
                      <Typography variant="large" className="font-bold text-primary-600">
                        {formatPrice(similarCar.pricePerDay)}/ngày
                      </Typography>
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <Typography variant="muted">{similarCar.rating}</Typography>
                      </div>
                    </div>
                    <Button 
                      onClick={() => router.push(`/car-rental/${similarCar.id}`)}
                      variant="secondary"
                      className="w-full mt-3"
                      size="sm"
                    >
                      Xem chi tiết
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
