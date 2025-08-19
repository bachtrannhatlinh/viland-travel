'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { apiClient } from '@/lib/utils';

// Shadcn/UI components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Typography } from '@/components/ui/typography';
import { DatePicker } from '@/components/ui/date-picker';

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  type: string;
  seats: number;
  transmission: string;
  fuelType: string;
  pricePerDay: number;
  totalPrice: number;
  rentalDays: number;
  currency: string;
  images: string[];
  features: string[];
  rating: number;
  reviewCount: number;
  fullName: string;
  location: {
    address: string;
    city: string;
    pickupPoints: Array<{
      name: string;
      address: string;
    }>;
  };
}

interface SearchParams {
  location: string;
  pickupDate: string;
  returnDate: string;
  carType: string;
  seats: string;
}

export default function CarRentalSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchCriteria, setSearchCriteria] = useState<SearchParams>({
    location: searchParams.get('location') || '',
    pickupDate: searchParams.get('pickupDate') || '',
    returnDate: searchParams.get('returnDate') || '',
    carType: searchParams.get('carType') || '',
    seats: searchParams.get('seats') || ''
  });
  
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [filters, setFilters] = useState({
    priceMin: '',
    priceMax: '',
    transmission: '',
    sortBy: 'price' // price, rating, seats
  });

  // Set default dates (today and tomorrow)
  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (!searchCriteria.pickupDate) {
      setSearchCriteria(prev => ({
        ...prev,
        pickupDate: today.toISOString().split('T')[0]
      }));
    }
    
    if (!searchCriteria.returnDate) {
      setSearchCriteria(prev => ({
        ...prev,
        returnDate: tomorrow.toISOString().split('T')[0]
      }));
    }
  }, [searchCriteria.pickupDate, searchCriteria.returnDate]);

  const handleInputChange = (field: keyof SearchParams, value: string) => {
    setSearchCriteria(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = useCallback(async () => {
    setLoading(true);
    setSearched(true);
    try {
      const params = {
        location: searchCriteria.location,
        pickupDate: searchCriteria.pickupDate,
        returnDate: searchCriteria.returnDate,
        carType: searchCriteria.carType,
        seats: searchCriteria.seats,
        priceMin: filters.priceMin,
        priceMax: filters.priceMax,
        transmission: filters.transmission
      };
      const data = await apiClient.get('/car-rental/search', params);
      if (data.success) {
        const rentalDays = calculateRentalDays();
        const normalizedCars: Car[] = data.data.map((raw: any) => {
          const pricePerDayRaw = raw.price_per_day ?? raw.pricePerDay ?? 0;
          const pricePerDay = Number(pricePerDayRaw) || 0;
          return {
            id: raw.id,
            make: raw.make,
            model: raw.model,
            year: raw.year,
            type: raw.type || 'economy',
            seats: raw.seats ?? 4,
            transmission: raw.transmission || raw.transmission_type || 'automatic',
            fuelType: raw.fuel_type || raw.fuelType || 'gasoline',
            pricePerDay,
            totalPrice: pricePerDay * (rentalDays || 1),
            rentalDays: rentalDays || 1,
            currency: raw.currency || 'VND',
            images: Array.isArray(raw.images) && raw.images.length ? raw.images : ['/images/car-placeholder.jpg'],
            features: Array.isArray(raw.features) && raw.features.length ? raw.features : ['Điều hòa', 'Bluetooth', 'Camera lùi'],
            rating: raw.rating || 4.6,
            reviewCount: raw.review_count || raw.reviewCount || 0,
            fullName: `${raw.year} ${raw.make} ${raw.model}`,
            location: {
              address: raw.location?.address || 'Trung tâm thành phố',
              city: raw.location?.city || 'TP. Hồ Chí Minh',
              pickupPoints: (raw.location?.pickupPoints || []).map((p: any, idx: number) => ({
                name: p?.name || `Điểm ${idx + 1}`,
                address: p?.address || raw.location?.address || 'Địa điểm',
              }))
            }
          };
        });
        let sortedCars = normalizedCars;
        // Apply sorting
        if (filters.sortBy === 'price') {
          sortedCars = sortedCars.sort((a: Car, b: Car) => a.pricePerDay - b.pricePerDay);
        } else if (filters.sortBy === 'rating') {
          sortedCars = sortedCars.sort((a: Car, b: Car) => b.rating - a.rating);
        } else if (filters.sortBy === 'seats') {
          sortedCars = sortedCars.sort((a: Car, b: Car) => a.seats - b.seats);
        }
        setCars(sortedCars);
        // Update URL with search params
        const url = new URL(window.location.href);
        Object.entries(searchCriteria).forEach(([key, value]) => {
          if (value) {
            url.searchParams.set(key, value);
          } else {
            url.searchParams.delete(key);
          }
        });
        router.replace(url.pathname + url.search, { scroll: false });
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  }, [searchCriteria, filters, router]);

  // Auto search if URL has search params
  useEffect(() => {
    if (searchParams.get('pickupDate') && searchParams.get('returnDate')) {
      handleSearch();
    }
  }, [searchParams, handleSearch]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const handleBookCar = (carId: string) => {
    const params = new URLSearchParams();
    if (searchCriteria.pickupDate) params.set('pickupDate', searchCriteria.pickupDate);
    if (searchCriteria.returnDate) params.set('returnDate', searchCriteria.returnDate);
    router.push(`/car-rental/${carId}/booking?${params.toString()}`);
  };

  const calculateRentalDays = () => {
    if (!searchCriteria.pickupDate || !searchCriteria.returnDate) return 1;
    const pickup = new Date(searchCriteria.pickupDate);
    const returnD = new Date(searchCriteria.returnDate);
    return Math.max(1, Math.ceil((returnD.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24)));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <Typography variant="h1" className="text-gray-900 mb-4">
            Thuê xe du lịch
          </Typography>
          <Typography variant="large" className="text-gray-600">
            Tìm kiếm và đặt xe phù hợp cho chuyến đi của bạn
          </Typography>
        </div>

        {/* Search Form */}
        <Card className="mb-12">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Địa điểm nhận xe
                </Label>
                <Input
                  type="text"
                  value={searchCriteria.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="TP. Hồ Chí Minh, Hà Nội..."
                  className="w-full"
                />
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày nhận xe
                </Label>
                <DatePicker
                  value={searchCriteria.pickupDate}
                  onChange={(value) => handleInputChange('pickupDate', value)}
                  min={new Date().toISOString().split('T')[0]}
                  placeholder="Chọn ngày nhận xe"
                  className="w-full"
                />
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày trả xe
                </Label>
                <DatePicker
                  value={searchCriteria.returnDate}
                  onChange={(value) => handleInputChange('returnDate', value)}
                  min={searchCriteria.pickupDate || new Date().toISOString().split('T')[0]}
                  placeholder="Chọn ngày trả xe"
                  className="w-full"
                />
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Loại xe
                </Label>
                <Select value={searchCriteria.carType === '' ? undefined : searchCriteria.carType} onValueChange={(value) => handleInputChange('carType', value || '')}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Tất cả loại xe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="economy">Xe tiết kiệm</SelectItem>
                    <SelectItem value="compact">Xe nhỏ gọn</SelectItem>
                    <SelectItem value="midsize">Xe trung bình</SelectItem>
                    <SelectItem value="standard">Xe tiêu chuẩn</SelectItem>
                    <SelectItem value="minivan">Xe 7 chỗ</SelectItem>
                    <SelectItem value="suv">Xe SUV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={handleSearch}
                  disabled={loading}
                  className="w-full py-3 disabled:opacity-50"
                >
                  {loading ? 'Đang tìm...' : 'Tìm xe'}
                </Button>
              </div>
            </div>
            
            {/* Additional Filters */}
            {searched && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-2">
                      Số chỗ ngồi
                    </Label>
                    <Select value={searchCriteria.seats === '' ? undefined : searchCriteria.seats} onValueChange={(value) => handleInputChange('seats', value || '')}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Tất cả" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="4">4 chỗ</SelectItem>
                        <SelectItem value="5">5 chỗ</SelectItem>
                        <SelectItem value="7">7 chỗ</SelectItem>
                        <SelectItem value="9">9+ chỗ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-2">
                      Giá từ (VNĐ/ngày)
                    </Label>
                    <Input
                      type="number"
                      value={filters.priceMin}
                      onChange={(e) => setFilters(prev => ({ ...prev, priceMin: e.target.value }))}
                      placeholder="500,000"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-2">
                      Giá đến (VNĐ/ngày)
                    </Label>
                    <Input
                      type="number"
                      value={filters.priceMax}
                      onChange={(e) => setFilters(prev => ({ ...prev, priceMax: e.target.value }))}
                      placeholder="2,000,000"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-2">
                      Sắp xếp theo
                    </Label>
                    <Select value={filters.sortBy} onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="price">Giá thấp nhất</SelectItem>
                        <SelectItem value="rating">Đánh giá cao nhất</SelectItem>
                        <SelectItem value="seats">Số chỗ ngồi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <Button 
                    onClick={handleSearch}
                    variant="secondary"
                    className="px-6 py-2"
                  >
                    Áp dụng bộ lọc
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Search Results */}
        {searched && (
          <div>
            {loading ? (
              <div className="text-center py-16">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                <p className="mt-4 text-gray-600">Đang tìm kiếm xe phù hợp...</p>
              </div>
            ) : cars.length > 0 ? (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <Typography variant="h2" className="text-gray-900">
                    Tìm thấy {cars.length} xe phù hợp
                  </Typography>
                  {searchCriteria.pickupDate && searchCriteria.returnDate && (
                    <Typography variant="p" className="text-gray-600">
                      {formatDate(searchCriteria.pickupDate)} - {formatDate(searchCriteria.returnDate)} ({calculateRentalDays()} ngày)
                    </Typography>
                  )}
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {cars.map((car) => (
                    <Card key={car.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="md:flex">
                        <div className="md:w-1/3">
                          <div className="relative h-48 md:h-full">
                            <Image
                              src={car.images[0] || '/images/car-placeholder.jpg'}
                              alt={car.fullName}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>
                        <CardContent className="md:w-2/3 p-6">
                          <div className="flex justify-between items-start mb-2">
                            <Typography variant="h3" className="text-gray-900">
                              {car.fullName}
                            </Typography>
                            <div className="flex items-center text-sm text-gray-600">
                              <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              {car.rating} ({car.reviewCount} đánh giá)
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                            <Typography variant="small" className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              {car.seats} chỗ
                            </Typography>
                            <Typography variant="small" className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {car.transmission === 'automatic' ? 'Tự động' : 'Số sàn'}
                            </Typography>
                            <Typography variant="small" className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {car.location.city}
                            </Typography>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            {car.features.slice(0, 3).map((feature, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                            {car.features.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{car.features.length - 3} khác
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div>
                              <Typography variant="large" className="font-bold text-primary-600">
                                {formatPrice(car.pricePerDay)}/ngày
                              </Typography>
                              {car.totalPrice && (
                                <Typography variant="small" className="text-gray-600">
                                  Tổng: {formatPrice(car.totalPrice)}
                                </Typography>
                              )}
                            </div>
                            <div className="space-x-2">
                              <Button 
                                onClick={() => {
                                  const params = new URLSearchParams();
                                  if (searchCriteria.pickupDate) params.set('pickupDate', searchCriteria.pickupDate);
                                  if (searchCriteria.returnDate) params.set('returnDate', searchCriteria.returnDate);
                                  router.push(`/car-rental/${car.id}?${params.toString()}`);
                                }}
                                variant="secondary"
                                size="sm"
                              >
                                Xem chi tiết
                              </Button>
                              <Button 
                                onClick={() => handleBookCar(car.id)}
                                size="sm"
                              >
                                Đặt xe
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-6">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <Typography variant="h3" className="text-gray-900 mb-2">
                  Không tìm thấy xe phù hợp
                </Typography>
                <Typography variant="p" className="text-gray-600 mb-6">
                  Thử thay đổi tiêu chí tìm kiếm hoặc mở rộng phạm vi tìm kiếm
                </Typography>
                <Button 
                  onClick={() => {
                    setSearchCriteria({
                      location: '',
                      pickupDate: new Date().toISOString().split('T')[0],
                      returnDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                      carType: '',
                      seats: ''
                    });
                    setFilters({
                      priceMin: '',
                      priceMax: '',
                      transmission: '',
                      sortBy: 'price'
                    });
                    setCars([]);
                    setSearched(false);
                  }}
                >
                  Tìm kiếm mới
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Default Car Types Display */}
        {!searched && (
          <div>
            <Typography variant="h2" className="text-gray-900 mb-8 text-center">
              Các loại xe phổ biến
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: 'Xe 4 chỗ',
                  description: 'Phù hợp cho gia đình nhỏ, cặp đôi',
                  price: 'Từ 800,000đ/ngày',
                  features: ['Tiết kiệm nhiên liệu', 'Dễ dàng di chuyển', 'Giá cả hợp lý'],
                  type: 'economy'
                },
                {
                  name: 'Xe 7 chỗ',
                  description: 'Lý tưởng cho gia đình, nhóm bạn',
                  price: 'Từ 1,200,000đ/ngày',
                  features: ['Rộng rãi thoải mái', 'An toàn cao', 'Phù hợp đường dài'],
                  type: 'minivan'
                },
                {
                  name: 'Xe SUV',
                  description: 'Mạnh mẽ, đa địa hình',
                  price: 'Từ 1,500,000đ/ngày',
                  features: ['Khả năng vận hành tốt', 'Không gian rộng', 'Thiết kế sang trọng'],
                  type: 'suv'
                }
              ].map((carType, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-gray-900">{carType.name}</CardTitle>
                    <Typography variant="p" className="text-gray-600">{carType.description}</Typography>
                  </CardHeader>
                  <CardContent>
                    <Typography variant="h4" className="text-primary-600 mb-4">{carType.price}</Typography>
                    <ul className="space-y-2 mb-6">
                      {carType.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      onClick={() => {
                        setSearchCriteria(prev => ({ ...prev, carType: carType.type }));
                        handleSearch();
                      }}
                      variant="secondary"
                      className="w-full"
                    >
                      Tìm {carType.name}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
