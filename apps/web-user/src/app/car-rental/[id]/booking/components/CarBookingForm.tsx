'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Typography } from '@/components/ui/typography';
import { Section } from '@/components/ui/section';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { DatePicker } from '@/components/ui/date-picker';

import { apiClient } from '@/lib/utils';
import { authService } from '@/lib/auth';
import { LoginRequiredDialog } from '@/components/ui/LoginRequiredDialog';

interface CarBookingFormProps {
  car: {
    id: string;
    make: string;
    model: string;
    year: number;
    fullName: string;
    pricePerDay: number;
    currency: string;
    seats: number;
    transmission: string;
    fuelType: string;
    images: string[];
    location: {
      city: string;
      pickupPoints: Array<{
        id: string;
        name: string;
        address: string;
        available24h: boolean;
        fee: number;
        openHours?: string;
      }>;
    };
    rentalTerms: {
      minAge: number;
      maxAge: number;
      additionalFees: {
        youngDriver: { age: string; fee: number; description: string };
        additionalDriver: { fee: number; description: string };
        gps: { fee: number; description: string };
        childSeat: { fee: number; description: string };
        delivery: { feePerKm: number; freeWithinKm: number; description: string };
      };
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
  };
}

interface DriverInfo {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  licenseNumber: string;
  licenseIssueDate: string;
  licenseExpiryDate: string;
  address: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

interface ContactInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
}

interface AdditionalServices {
  comprehensiveInsurance: boolean;
  gps: boolean;
  childSeat: boolean;
  additionalDriver: boolean;
  delivery: boolean;
  deliveryAddress?: string;
}

export default function CarBookingForm({ car }: CarBookingFormProps) {
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Rental Details
  const [pickupDate, setPickupDate] = useState(searchParams.get('pickupDate') || '');
  const [returnDate, setReturnDate] = useState(searchParams.get('returnDate') || '');
  const [pickupLocation, setPickupLocation] = useState(searchParams.get('pickupLocation') || car.location.pickupPoints[0]?.id || '');
  const [returnLocation, setReturnLocation] = useState(car.location.pickupPoints[0]?.id || '');
  const [pickupTime, setPickupTime] = useState('10:00');
  const [returnTime, setReturnTime] = useState('10:00');
  
  // Driver Info
  const [driverInfo, setDriverInfo] = useState<DriverInfo>({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    licenseNumber: '',
    licenseIssueDate: '',
    licenseExpiryDate: '',
    address: '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    }
  });
  
  // Contact Info (if different from driver)
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    fullName: '',
    email: '',
    phone: '',
    address: ''
  });
  
  const [sameAsDriver, setSameAsDriver] = useState(true);
  
  // Additional Services
  const [additionalServices, setAdditionalServices] = useState<AdditionalServices>({
    comprehensiveInsurance: false,
    gps: false,
    childSeat: false,
    additionalDriver: false,
    delivery: false,
    deliveryAddress: ''
  });
  
  const [specialRequests, setSpecialRequests] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('vnpay');

  // Set default dates if not provided
  useEffect(() => {
    if (!pickupDate) {
      const today = new Date();
      setPickupDate(today.toISOString().split('T')[0]);
    }
    if (!returnDate) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setReturnDate(tomorrow.toISOString().split('T')[0]);
    }
    // Set default times
    if (!pickupTime) {
      setPickupTime('10:00');
    }
    if (!returnTime) {
      setReturnTime('10:00');
    }
    // Set default pickup points (use first available)
    if (!pickupLocation && car.location.pickupPoints.length > 0) {
      setPickupLocation(car.location.pickupPoints[0].id);
    }
    if (!returnLocation && car.location.pickupPoints.length > 0) {
      setReturnLocation(car.location.pickupPoints[0].id);
    }
  }, [pickupDate, returnDate, pickupTime, returnTime, pickupLocation, returnLocation, car.location.pickupPoints]);

  // Auto-sync contact info if same as driver
  useEffect(() => {
    if (sameAsDriver) {
      setContactInfo({
        fullName: driverInfo.fullName,
        email: driverInfo.email,
        phone: driverInfo.phone,
        address: driverInfo.address
      });
    }
  }, [sameAsDriver, driverInfo]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const calculateRentalDays = () => {
    if (!pickupDate || !returnDate) return 1;
    const pickup = new Date(pickupDate);
    const returnD = new Date(returnDate);
    return Math.max(1, Math.ceil((returnD.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24)));
  };

  const calculateTotalPrice = () => {
    const rentalDays = calculateRentalDays();
    let total = car.pricePerDay * rentalDays;
    
    // Add additional services
    if (additionalServices.comprehensiveInsurance) {
      total += car.insurance.comprehensive.pricePerDay * rentalDays;
    }
    if (additionalServices.gps) {
      total += car.rentalTerms.additionalFees.gps.fee * rentalDays;
    }
    if (additionalServices.childSeat) {
      total += car.rentalTerms.additionalFees.childSeat.fee * rentalDays;
    }
    if (additionalServices.additionalDriver) {
      total += car.rentalTerms.additionalFees.additionalDriver.fee * rentalDays;
    }
    
    // Check for young driver fee
    if (driverInfo.dateOfBirth) {
      const driverAge = new Date().getFullYear() - new Date(driverInfo.dateOfBirth).getFullYear();
      if (driverAge >= 22 && driverAge <= 24) {
        total += car.rentalTerms.additionalFees.youngDriver.fee * rentalDays;
      }
    }
    
    return total;
  };

  const validateStep1 = () => {
    const isValid = pickupDate && returnDate && pickupLocation && returnLocation && pickupTime && returnTime;
    return isValid;
  };

  const validateStep2 = () => {
    return driverInfo.fullName && driverInfo.email && driverInfo.phone && 
           driverInfo.dateOfBirth && driverInfo.licenseNumber && 
           driverInfo.licenseIssueDate && driverInfo.licenseExpiryDate && 
           driverInfo.address && driverInfo.emergencyContact.name && 
           driverInfo.emergencyContact.phone;
  };

  const validateStep3 = () => {
    if (sameAsDriver) return true;
    return contactInfo.fullName && contactInfo.email && contactInfo.phone && contactInfo.address;
  };

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBookingSubmit = async () => {
    if (!authService.isAuthenticated()) {
      setShowLoginDialog(true);
      return;
    }
    setIsProcessing(true);
    try {
      const bookingData = {
        carId: car.id,
        pickupDate: `${pickupDate}T${pickupTime}:00`,
        returnDate: `${returnDate}T${returnTime}:00`,
        pickupLocation: pickupLocation,
        returnLocation: returnLocation,
        driverInfo,
        contactInfo: sameAsDriver ? driverInfo : contactInfo,
        additionalServices,
        specialRequests,
        totalPrice: calculateTotalPrice(),
        paymentMethod
      };
      const result = await apiClient.post('/car-rental/book', bookingData);
      if (result?.success) {
        if (result.redirectUrl) {
          window.location.href = result.redirectUrl;
          return;
        }
        router.push(`/car-rental/${car.id}`);
      } else {
        alert(result?.message || 'Có lỗi xảy ra khi đặt xe');
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Có lỗi xảy ra khi đặt xe. Vui lòng thử lại.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getSelectedPickupPoint = () => {
    return car.location.pickupPoints.find(point => point.id === pickupLocation);
  };

  const getSelectedReturnPoint = () => {
    return car.location.pickupPoints.find(point => point.id === returnLocation);
  };

  return (
    <>
      <LoginRequiredDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
      <Section as="section" className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 bg-primary-600 text-white rounded-full text-sm font-semibold">
                  1
                </div>
                <Typography variant="small" className="ml-2 font-medium text-primary-600">Chọn xe</Typography>
              </div>
              <Separator className="flex-1 bg-primary-600 mx-4 h-0.5" />
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 bg-primary-600 text-white rounded-full text-sm font-semibold">
                  2
                </div>
                <Typography variant="small" className="ml-2 font-medium text-primary-600">Chọn thời gian</Typography>
              </div>
              <Separator className="flex-1 bg-primary-600 mx-4 h-0.5" />
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 bg-primary-600 text-white rounded-full text-sm font-semibold">
                  3
                </div>
                <Typography variant="small" className="ml-2 font-medium text-primary-600">Đặt xe</Typography>
              </div>
              <Separator className="flex-1 bg-gray-300 mx-4 h-0.5" />
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 bg-gray-300 text-gray-600 rounded-full text-sm font-semibold">
                  4
                </div>
                <Typography variant="small" className="ml-2 font-medium text-gray-600">Thanh toán</Typography>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
              {/* Step 1: Rental Details */}
              {currentStep === 1 && (
                <div>
                  <Typography variant="h2" className="text-gray-900 mb-6">Chi tiết thuê xe</Typography>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">
                        Ngày nhận xe *
                      </Label>
                      <DatePicker
                        value={pickupDate}
                        onChange={setPickupDate}
                        min={new Date().toISOString().split('T')[0]}
                        placeholder="Chọn ngày nhận xe"
                      />
                    </div>
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">
                        Giờ nhận xe *
                      </Label>
                      <Select value={pickupTime === '' ? undefined : pickupTime} onValueChange={setPickupTime}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Chọn giờ" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }, (_, i) => {
                            const hour = i.toString().padStart(2, '0');
                            return (
                              <SelectItem key={hour} value={`${hour}:00`}>
                                {hour}:00
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">
                        Ngày trả xe *
                      </Label>
                      <DatePicker
                        value={returnDate}
                        onChange={setReturnDate}
                        min={pickupDate || new Date().toISOString().split('T')[0]}
                        placeholder="Chọn ngày trả xe"
                      />
                    </div>
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">
                        Giờ trả xe *
                      </Label>
                      <Select value={returnTime === '' ? undefined : returnTime} onValueChange={setReturnTime}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Chọn giờ" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }, (_, i) => {
                            const hour = i.toString().padStart(2, '0');
                            return (
                              <SelectItem key={hour} value={`${hour}:00`}>
                                {hour}:00
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">
                        Điểm nhận xe *
                      </Label>
                      <Select value={pickupLocation === '' ? undefined : pickupLocation} onValueChange={setPickupLocation}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Chọn điểm nhận xe" />
                        </SelectTrigger>
                        <SelectContent>
                          {car.location.pickupPoints.map((point) => (
                            <SelectItem key={point.id} value={point.id}>
                              {point.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {getSelectedPickupPoint() && (
                        <div className="mt-2 text-sm text-gray-600">
                          <Typography variant="muted">{getSelectedPickupPoint()?.address}</Typography>
                          <Typography 
                            variant="small" 
                            className={`font-medium ${
                              getSelectedPickupPoint()?.available24h ? 'text-green-600' : 'text-yellow-600'
                            }`}
                          >
                            {getSelectedPickupPoint()?.available24h ? '24/7' : getSelectedPickupPoint()?.openHours}
                          </Typography>
                        </div>
                      )}
                    </div>
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">
                        Điểm trả xe *
                      </Label>
                      <Select value={returnLocation === '' ? undefined : returnLocation} onValueChange={setReturnLocation}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Chọn điểm trả xe" />
                        </SelectTrigger>
                        <SelectContent>
                          {car.location.pickupPoints.map((point) => (
                            <SelectItem key={point.id} value={point.id}>
                              {point.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {getSelectedReturnPoint() && (
                        <div className="mt-2 text-sm text-gray-600">
                          <Typography variant="muted">{getSelectedReturnPoint()?.address}</Typography>
                          <Typography 
                            variant="small"
                            className={`font-medium ${
                              getSelectedReturnPoint()?.available24h ? 'text-green-600' : 'text-yellow-600'
                            }`}
                          >
                            {getSelectedReturnPoint()?.available24h ? '24/7' : getSelectedReturnPoint()?.openHours}
                          </Typography>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Rental Summary */}
                  <Card className="bg-gray-50">
                    <CardContent className="p-4">
                      <Typography variant="h6" className="text-gray-900 mb-2">Tóm tắt thời gian thuê</Typography>
                      <div className="text-sm text-gray-600">
                        <Typography variant="muted">Từ: {formatDate(pickupDate)} {pickupTime}</Typography>
                        <Typography variant="muted">Đến: {formatDate(returnDate)} {returnTime}</Typography>
                        <Typography variant="small" className="font-medium text-primary-600">
                          Tổng: {calculateRentalDays()} ngày
                        </Typography>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Step 2: Driver Information */}
              {currentStep === 2 && (
                <div>
                  <Typography variant="h2" className="text-gray-900 mb-6">Thông tin tài xế</Typography>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">
                        Họ và tên *
                      </Label>
                      <Input
                        type="text"
                        value={driverInfo.fullName}
                        onChange={(e) => setDriverInfo({...driverInfo, fullName: e.target.value})}
                        placeholder="Nhập họ và tên"
                      />
                    </div>
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </Label>
                      <Input
                        type="email"
                        value={driverInfo.email}
                        onChange={(e) => setDriverInfo({...driverInfo, email: e.target.value})}
                        placeholder="Nhập email"
                      />
                    </div>
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">
                        Số điện thoại *
                      </Label>
                      <Input
                        type="tel"
                        value={driverInfo.phone}
                        onChange={(e) => setDriverInfo({...driverInfo, phone: e.target.value})}
                        placeholder="Nhập số điện thoại"
                      />
                    </div>
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">
                        Ngày sinh *
                      </Label>
                      <DatePicker
                        value={driverInfo.dateOfBirth}
                        onChange={(value) => setDriverInfo({...driverInfo, dateOfBirth: value})}
                        max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                        placeholder="Chọn ngày sinh"
                      />
                    </div>
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">
                        Số bằng lái xe *
                      </Label>
                      <Input
                        type="text"
                        value={driverInfo.licenseNumber}
                        onChange={(e) => setDriverInfo({...driverInfo, licenseNumber: e.target.value})}
                        placeholder="Nhập số bằng lái"
                      />
                    </div>
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">
                        Ngày cấp bằng lái *
                      </Label>
                      <DatePicker
                        value={driverInfo.licenseIssueDate}
                        onChange={(value) => setDriverInfo({...driverInfo, licenseIssueDate: value})}
                        placeholder="Chọn ngày cấp bằng lái"
                      />
                    </div>
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">
                        Ngày hết hạn bằng lái *
                      </Label>
                      <DatePicker
                        value={driverInfo.licenseExpiryDate}
                        onChange={(value) => setDriverInfo({...driverInfo, licenseExpiryDate: value})}
                        min={new Date().toISOString().split('T')[0]}
                        placeholder="Chọn ngày hết hạn"
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <Label className="block text-sm font-medium text-gray-700 mb-2">
                      Địa chỉ *
                    </Label>
                    <Textarea
                      value={driverInfo.address}
                      onChange={(e) => setDriverInfo({...driverInfo, address: e.target.value})}
                      rows={3}
                      placeholder="Nhập địa chỉ đầy đủ"
                    />
                  </div>

                  <div className="mb-6">
                    <Typography variant="h5" className="text-gray-900 mb-4">Liên hệ khẩn cấp</Typography>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="block text-sm font-medium text-gray-700 mb-2">
                          Họ và tên *
                        </Label>
                        <Input
                          type="text"
                          value={driverInfo.emergencyContact.name}
                          onChange={(e) => setDriverInfo({
                            ...driverInfo,
                            emergencyContact: {...driverInfo.emergencyContact, name: e.target.value}
                          })}
                          placeholder="Nhập họ tên"
                        />
                      </div>
                      <div>
                        <Label className="block text-sm font-medium text-gray-700 mb-2">
                          Số điện thoại *
                        </Label>
                        <Input
                          type="tel"
                          value={driverInfo.emergencyContact.phone}
                          onChange={(e) => setDriverInfo({
                            ...driverInfo,
                            emergencyContact: {...driverInfo.emergencyContact, phone: e.target.value}
                          })}
                          placeholder="Nhập số điện thoại"
                        />
                      </div>
                      <div>
                        <Label className="block text-sm font-medium text-gray-700 mb-2">
                          Mối quan hệ *
                        </Label>
                        <Select 
                          value={driverInfo.emergencyContact.relationship} 
                          onValueChange={(value) => setDriverInfo({
                            ...driverInfo,
                            emergencyContact: {...driverInfo.emergencyContact, relationship: value}
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn mối quan hệ" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="spouse">Vợ/Chồng</SelectItem>
                            <SelectItem value="parent">Cha/Mẹ</SelectItem>
                            <SelectItem value="sibling">Anh/Chị/Em</SelectItem>
                            <SelectItem value="friend">Bạn bè</SelectItem>
                            <SelectItem value="colleague">Đồng nghiệp</SelectItem>
                            <SelectItem value="other">Khác</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Age Warning */}
                  {driverInfo.dateOfBirth && (
                    (() => {
                      const driverAge = new Date().getFullYear() - new Date(driverInfo.dateOfBirth).getFullYear();
                      if (driverAge < car.rentalTerms.minAge) {
                        return (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                            <div className="flex items-center">
                              <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                              </svg>
                              <p className="text-red-800">
                                Tài xế phải từ {car.rentalTerms.minAge} tuổi trở lên để thuê xe này.
                              </p>
                            </div>
                          </div>
                        );
                      } else if (driverAge >= 22 && driverAge <= 24) {
                        return (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                            <div className="flex items-center">
                              <svg className="w-5 h-5 text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <p className="text-yellow-800">
                                Tài xế dưới 25 tuổi sẽ có phụ phí {formatPrice(car.rentalTerms.additionalFees.youngDriver.fee)}/ngày.
                              </p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })()
                  )}
                </div>
              )}

              {/* Step 3: Contact & Additional Services */}
              {currentStep === 3 && (
                <div>
                  <Typography variant="h2" className="text-gray-900 mb-6">Thông tin liên hệ & Dịch vụ bổ sung</Typography>
                  
                  {/* Contact Information */}
                  <div className="mb-8">
                    <div className="flex items-center mb-4">
                      <input
                        type="checkbox"
                        id="sameAsDriver"
                        checked={sameAsDriver}
                        onChange={(e) => setSameAsDriver(e.target.checked)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <Label htmlFor="sameAsDriver" className="ml-2 text-sm font-medium text-gray-700">
                        Thông tin liên hệ giống với tài xế
                      </Label>
                    </div>

                    {!sameAsDriver && (
                      <div>
                        <Typography variant="h5" className="text-gray-900 mb-4">Thông tin người liên hệ</Typography>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <Label className="block text-sm font-medium text-gray-700 mb-2">
                              Họ và tên *
                            </Label>
                            <Input
                              type="text"
                              value={contactInfo.fullName}
                              onChange={(e) => setContactInfo({...contactInfo, fullName: e.target.value})}
                              placeholder="Nhập họ và tên"
                            />
                          </div>
                          <div>
                            <Label className="block text-sm font-medium text-gray-700 mb-2">
                              Email *
                            </Label>
                            <Input
                              type="email"
                              value={contactInfo.email}
                              onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                              placeholder="Nhập email"
                            />
                          </div>
                          <div>
                            <Label className="block text-sm font-medium text-gray-700 mb-2">
                              Số điện thoại *
                            </Label>
                            <Input
                              type="tel"
                              value={contactInfo.phone}
                              onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                              placeholder="Nhập số điện thoại"
                            />
                          </div>
                          <div>
                            <Label className="block text-sm font-medium text-gray-700 mb-2">
                              Địa chỉ *
                            </Label>
                            <Input
                              type="text"
                              value={contactInfo.address}
                              onChange={(e) => setContactInfo({...contactInfo, address: e.target.value})}
                              placeholder="Nhập địa chỉ"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Additional Services */}
                  <div className="mb-8">
                    <Typography variant="h5" className="text-gray-900 mb-4">Dịch vụ bổ sung</Typography>
                    
                    <div className="space-y-4">
                      {/* Comprehensive Insurance */}
                      <Card className="p-4">
                        <div className="flex items-start">
                          <input
                            type="checkbox"
                            id="comprehensiveInsurance"
                            checked={additionalServices.comprehensiveInsurance}
                            onChange={(e) => setAdditionalServices({
                              ...additionalServices,
                              comprehensiveInsurance: e.target.checked
                            })}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
                          />
                          <div className="ml-3 flex-1">
                            <Label htmlFor="comprehensiveInsurance" className="font-medium text-gray-900">
                              Bảo hiểm toàn diện
                            </Label>
                            <Typography variant="muted" className="mt-1">
                              {car.insurance.comprehensive.description}
                            </Typography>
                            <Typography variant="small" className="font-semibold text-primary-600 mt-1">
                              {formatPrice(car.insurance.comprehensive.pricePerDay)}/ngày
                            </Typography>
                          </div>
                        </div>
                      </Card>

                      {/* GPS */}
                      <Card className="p-4">
                        <div className="flex items-start">
                          <input
                            type="checkbox"
                            id="gps"
                            checked={additionalServices.gps}
                            onChange={(e) => setAdditionalServices({
                              ...additionalServices,
                              gps: e.target.checked
                            })}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
                          />
                          <div className="ml-3 flex-1">
                            <Label htmlFor="gps" className="font-medium text-gray-900">
                              Thiết bị GPS
                            </Label>
                            <Typography variant="muted" className="mt-1">
                              {car.rentalTerms.additionalFees.gps.description}
                            </Typography>
                            <Typography variant="small" className="font-semibold text-primary-600 mt-1">
                              {formatPrice(car.rentalTerms.additionalFees.gps.fee)}/ngày
                            </Typography>
                          </div>
                        </div>
                      </Card>

                      {/* Child Seat */}
                      <div className="flex items-start p-4 border rounded-lg">
                        <input
                          type="checkbox"
                          id="childSeat"
                          checked={additionalServices.childSeat}
                          onChange={(e) => setAdditionalServices({
                            ...additionalServices,
                            childSeat: e.target.checked
                          })}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
                        />
                        <div className="ml-3 flex-1">
                          <Label htmlFor="childSeat" className="font-medium text-gray-900">
                            Ghế an toàn trẻ em
                          </Label>
                          <Typography as="p" className="text-sm text-gray-600 mt-1">
                            {car.rentalTerms.additionalFees.childSeat.description}
                          </Typography>
                          <Typography as="div" className="text-sm font-semibold text-primary-600 mt-1">
                            {formatPrice(car.rentalTerms.additionalFees.childSeat.fee)}/ngày
                          </Typography>
                        </div>
                      </div>

                      {/* Additional Driver */}
                      <div className="flex items-start p-4 border rounded-lg">
                        <input
                          type="checkbox"
                          id="additionalDriver"
                          checked={additionalServices.additionalDriver}
                          onChange={(e) => setAdditionalServices({
                            ...additionalServices,
                            additionalDriver: e.target.checked
                          })}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
                        />
                        <div className="ml-3 flex-1">
                          <Label htmlFor="additionalDriver" className="font-medium text-gray-900">
                            Tài xế phụ
                          </Label>
                          <Typography as="p" className="text-sm text-gray-600 mt-1">
                            {car.rentalTerms.additionalFees.additionalDriver.description}
                          </Typography>
                          <Typography as="div" className="text-sm font-semibold text-primary-600 mt-1">
                            {formatPrice(car.rentalTerms.additionalFees.additionalDriver.fee)}/ngày
                          </Typography>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-2">
                      Yêu cầu đặc biệt (không bắt buộc)
                    </Label>
                    <Textarea
                      rows={4}
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      className="w-full"
                      placeholder="Nhập yêu cầu đặc biệt nếu có..."
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Payment */}
              {currentStep === 4 && (
                <div>
                  <Typography variant="h2" className="text-gray-900 mb-6">Thanh toán</Typography>
                  
                  <div className="mb-6">
                    <Typography variant="h3" className="text-gray-900 mb-4">Chọn phương thức thanh toán</Typography>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { id: 'vnpay', name: 'VNPay', icon: '🏦' },
                        { id: 'momo', name: 'MoMo', icon: '📱' },
                        { id: 'zalopay', name: 'ZaloPay', icon: '💳' },
                        { id: 'onepay', name: 'OnePay', icon: '💰' }
                      ].map((method) => (
                        <Label
                          key={method.id}
                          className={`flex items-center p-4 border rounded-lg cursor-pointer ${
                            paymentMethod === method.id
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={method.id}
                            checked={paymentMethod === method.id}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="sr-only"
                          />
                          <Typography as="span" className="text-2xl mr-3">{method.icon}</Typography>
                          <Typography as="span" className="font-medium text-gray-900">{method.name}</Typography>
                        </Label>
                      ))}
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <Typography variant="h4" className="text-gray-900 mb-3">Điều khoản và điều kiện</Typography>
                    <div className="text-sm text-gray-600 space-y-2">
                      <Typography as="p">• Bằng việc đặt xe, bạn đồng ý với các điều khoản sử dụng của chúng tôi</Typography>
                      <Typography as="p">• Hủy miễn phí trong vòng 24 giờ trước khi nhận xe</Typography>
                      <Typography as="p">• Phí hủy 50% nếu hủy trong vòng 12 giờ trước khi nhận xe</Typography>
                      <Typography as="p">• Tài xế phải mang theo bằng lái xe hợp lệ khi nhận xe</Typography>
                      <Typography as="p">• Xe phải được trả trong tình trạng sạch sẽ và đầy bình như khi nhận</Typography>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                <div>
                  {currentStep > 1 && (
                    <Button
                      onClick={handlePreviousStep}
                      variant="outline"
                      className="px-6 py-3"
                    >
                      Quay lại
                    </Button>
                  )}
                </div>
                <div>
                  {currentStep < 4 ? (
                    <Button
                      onClick={handleNextStep}
                      disabled={
                        (currentStep === 1 && !validateStep1()) ||
                        (currentStep === 2 && !validateStep2()) ||
                        (currentStep === 3 && !validateStep3())
                      }
                      className="px-6 py-3"
                    >
                      Tiếp tục
                    </Button>
                  ) : (
                    <Button
                      onClick={handleBookingSubmit}
                      disabled={isProcessing}
                      className="px-6 py-3"
                    >
                      {isProcessing ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Đang xử lý...
                        </>
                      ) : (
                        'Xác nhận đặt xe'
                      )}
                    </Button>
                  )}
                </div>
              </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg">Tóm tắt đặt xe</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Car Info */}
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 relative rounded-lg overflow-hidden">
                    <Image
                      src={car.images[0] || '/images/car-placeholder.jpg'}
                      alt={car.fullName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="ml-4">
                    <Typography variant="h6" className="text-gray-900">{car.fullName}</Typography>
                    <Typography variant="muted">
                      {car.seats} chỗ • {car.transmission === 'automatic' ? 'Tự động' : 'Số sàn'}
                    </Typography>
                  </div>
                </div>

                {/* Rental Details */}
                <div className="space-y-3 text-sm mb-6">
                  <div className="flex justify-between">
                    <Typography variant="muted">Thời gian thuê:</Typography>
                    <Typography variant="small" className="font-medium">{calculateRentalDays()} ngày</Typography>
                  </div>
                  {pickupDate && (
                    <div className="flex justify-between">
                      <Typography variant="muted">Nhận xe:</Typography>
                      <Typography variant="small" className="font-medium">{formatDate(pickupDate)}</Typography>
                    </div>
                  )}
                  {returnDate && (
                    <div className="flex justify-between">
                      <Typography variant="muted">Trả xe:</Typography>
                      <Typography variant="small" className="font-medium">{formatDate(returnDate)}</Typography>
                    </div>
                  )}
                </div>

              {/* Price Breakdown */}
              <div className="space-y-3 text-sm border-t border-gray-200 pt-4">
                <div className="flex justify-between">
                  <Typography as="span" className="text-gray-600">Giá thuê ({calculateRentalDays()} ngày):</Typography>
                  <Typography as="span" className="font-medium">{formatPrice(car.pricePerDay * calculateRentalDays())}</Typography>
                </div>
                
                {additionalServices.comprehensiveInsurance && (
                  <div className="flex justify-between">
                    <Typography as="span" className="text-gray-600">Bảo hiểm toàn diện:</Typography>
                    <Typography as="span" className="font-medium">{formatPrice(car.insurance.comprehensive.pricePerDay * calculateRentalDays())}</Typography>
                  </div>
                )}
                
                {additionalServices.gps && (
                  <div className="flex justify-between">
                    <Typography as="span" className="text-gray-600">Thiết bị GPS:</Typography>
                    <Typography as="span" className="font-medium">{formatPrice(car.rentalTerms.additionalFees.gps.fee * calculateRentalDays())}</Typography>
                  </div>
                )}
                
                {additionalServices.childSeat && (
                  <div className="flex justify-between">
                    <Typography as="span" className="text-gray-600">Ghế trẻ em:</Typography>
                    <Typography as="span" className="font-medium">{formatPrice(car.rentalTerms.additionalFees.childSeat.fee * calculateRentalDays())}</Typography>
                  </div>
                )}
                
                {additionalServices.additionalDriver && (
                  <div className="flex justify-between">
                    <Typography as="span" className="text-gray-600">Tài xế phụ:</Typography>
                    <Typography as="span" className="font-medium">{formatPrice(car.rentalTerms.additionalFees.additionalDriver.fee * calculateRentalDays())}</Typography>
                  </div>
                )}
                
                {driverInfo.dateOfBirth && (() => {
                  const driverAge = new Date().getFullYear() - new Date(driverInfo.dateOfBirth).getFullYear();
                  if (driverAge >= 22 && driverAge <= 24) {
                    return (
                      <div className="flex justify-between">
                        <Typography as="span" className="text-gray-600">Phí tài xế trẻ:</Typography>
                        <Typography as="span" className="font-medium">{formatPrice(car.rentalTerms.additionalFees.youngDriver.fee * calculateRentalDays())}</Typography>
                      </div>
                    );
                  }
                  return null;
                })()}
                
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <Typography as="span" className="text-gray-900 font-semibold">Tổng tiền:</Typography>
                    <Typography as="span" className="text-primary-600 font-bold text-lg">
                      {formatPrice(calculateTotalPrice())}
                    </Typography>
                  </div>
                </div>
              </div>

              {/* Important Notes */}
              <Card className="mt-6 bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="text-blue-800">
                    <Typography variant="small" className="font-medium mb-1">Lưu ý quan trọng:</Typography>
                    <ul className="text-sm space-y-1">
                      <li><Typography as="span">• Mang theo bằng lái xe hợp lệ</Typography></li>
                      <li><Typography as="span">• Kiểm tra xe kỹ trước khi nhận</Typography></li>
                      <li><Typography as="span">• Liên hệ hotline: 1900 1234</Typography></li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Section>
    </>
  );
}
