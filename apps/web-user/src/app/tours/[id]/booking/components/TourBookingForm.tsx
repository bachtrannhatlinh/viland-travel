'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DatePicker } from '@/components/ui/date-picker'
import { Label } from '@/components/ui/label'
import { Typography } from '@/components/ui/typography'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface TourData {
  id: string
  title: string
  duration: { days: number; nights: number }
  price: {
    adult: number
    child: number
    infant: number
    currency: string
  }
  discountPrice?: {
    adult: number
    child: number
    infant: number
  }
  availability: Array<{
    startDate: string
    endDate: string
    availableSlots: number
    isAvailable: boolean
  }>
  maxGroupSize: number
  minGroupSize: number
}

interface TourBookingFormProps {
  tour: TourData
}

interface ContactInfo {
  fullName: string
  email: string
  phone: string
  address: string
}

interface ParticipantInfo {
  fullName: string
  dateOfBirth: string
  gender: 'male' | 'female'
  identityCard: string
  type: 'adult' | 'child' | 'infant'
}

export default function TourBookingForm({ tour }: TourBookingFormProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState('')
  const [participants, setParticipants] = useState({
    adults: 2,
    children: 0,
    infants: 0
  })
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    fullName: '',
    email: '',
    phone: '',
    address: ''
  })
  const [participantDetails, setParticipantDetails] = useState<ParticipantInfo[]>([])
  const [specialRequests, setSpecialRequests] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const calculateTotalPrice = () => {
    const prices = tour.discountPrice || tour.price
    const adultTotal = participants.adults * prices.adult
    const childTotal = participants.children * prices.child
    const infantTotal = participants.infants * prices.infant
    return adultTotal + childTotal + infantTotal
  }

  const getTotalParticipants = () => {
    return participants.adults + participants.children + participants.infants
  }

  const initializeParticipantDetails = () => {
    const details: ParticipantInfo[] = []
    
    // Add adults
    for (let i = 0; i < participants.adults; i++) {
      details.push({
        fullName: '',
        dateOfBirth: '',
        gender: 'male',
        identityCard: '',
        type: 'adult'
      })
    }
    
    // Add children
    for (let i = 0; i < participants.children; i++) {
      details.push({
        fullName: '',
        dateOfBirth: '',
        gender: 'male',
        identityCard: '',
        type: 'child'
      })
    }
    
    // Add infants
    for (let i = 0; i < participants.infants; i++) {
      details.push({
        fullName: '',
        dateOfBirth: '',
        gender: 'male',
        identityCard: '',
        type: 'infant'
      })
    }
    
    setParticipantDetails(details)
  }

  const handleParticipantChange = (field: keyof typeof participants, value: number) => {
    const newParticipants = { ...participants, [field]: value }
    const total = newParticipants.adults + newParticipants.children + newParticipants.infants
    
    // Luôn cho phép update, chỉ validate khi submit
    if (total <= tour.maxGroupSize && value >= 0) {
      setParticipants(newParticipants)
    }
  }

  const handleParticipantDetailChange = (index: number, field: keyof ParticipantInfo, value: string) => {
    const updated = [...participantDetails]
    updated[index] = { ...updated[index], [field]: value }
    setParticipantDetails(updated)
  }

  const validateStep1 = () => {
    const total = getTotalParticipants()
    const hasValidDate = selectedDate && selectedDate.trim() !== ''
    const hasValidParticipants = total >= tour.minGroupSize && total <= tour.maxGroupSize
    
    return hasValidDate && hasValidParticipants
  }

  const validateStep2 = () => {
    const result = contactInfo.fullName && contactInfo.email && contactInfo.phone && contactInfo.address
    
    return Boolean(result)
  }

  const validateStep3 = () => {
    const result = participantDetails.every(p => p.fullName && p.dateOfBirth && p.identityCard)
    
    return result
  }

  const handleNextStep = () => {
    console.log('Button clicked! Current step:', currentStep)
    
    if (currentStep === 1 && validateStep1()) {
      console.log('Moving to step 2')
      initializeParticipantDetails()
      setCurrentStep(2)
    } else if (currentStep === 2 && validateStep2()) {
      console.log('Moving to step 3')
      setCurrentStep(3)
    } else if (currentStep === 3 && validateStep3()) {
      console.log('Moving to step 4')
      setCurrentStep(4)
    } else {
      console.log('Validation failed for step:', currentStep)
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleBookingSubmit = async () => {
    setIsProcessing(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const bookingData = {
        tourId: tour.id,
        tourTitle: tour.title,
        selectedDate,
        participants,
        contactInfo,
        participantDetails,
        specialRequests,
        totalAmount: calculateTotalPrice(),
        bookingDate: new Date().toISOString(),
        status: 'pending'
      }
      
      // Store booking data for payment page
      sessionStorage.setItem('tourBookingData', JSON.stringify(bookingData))
      
      // Navigate to payment page
      router.push(`/tours/${tour.id}/payment`)
    } catch (error) {
      console.error('Booking error:', error)
      alert('Có lỗi xảy ra khi đặt tour. Vui lòng thử lại.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Form */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Step 1: Select Date & Participants */}
          {currentStep === 1 && (
            <div>
              <Typography variant="h2" className="text-gray-900 mb-6">Chọn ngày và số lượng khách</Typography>
              
              {/* Date Selection */}
              <div className="mb-8">
                <Typography variant="h3" className="text-gray-900 mb-4">Chọn ngày khởi hành</Typography>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tour.availability.map((date, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedDate(date.startDate)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        selectedDate === date.startDate
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-primary-300'
                      }`}
                    >
                      <Typography as="div" className="font-semibold text-gray-900">
                        {formatDate(date.startDate)}
                      </Typography>
                      <Typography as="div" className="text-sm text-gray-600 mt-1">
                        Kết thúc: {formatDate(date.endDate)}
                      </Typography>
                      <Typography as="div" className="text-sm text-green-600 mt-2">
                        Còn {date.availableSlots} chỗ
                      </Typography>
                    </div>
                  ))}
                </div>
              </div>

              {/* Participant Selection */}
              <div>
                <Typography variant="h3" className="text-gray-900 mb-4">Số lượng khách</Typography>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-4 border-b border-gray-200">
                    <div>
                      <Typography as="div" className="font-medium text-gray-900">Người lớn</Typography>
                      <Typography as="div" className="text-sm text-gray-600">Từ 12 tuổi trở lên</Typography>
                      <Typography as="div" className="text-sm font-medium text-primary-600">
                        {formatPrice(tour.discountPrice?.adult || tour.price.adult)}
                      </Typography>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Button
                        onClick={() => handleParticipantChange('adults', Math.max(0, participants.adults - 1))}
                        variant="outline"
                        size="icon"
                        disabled={participants.adults <= 1}
                      >
                        -
                      </Button>
                      <Typography as="span" className="w-8 text-center font-medium">{participants.adults}</Typography>
                      <Button
                        onClick={() => handleParticipantChange('adults', participants.adults + 1)}
                        variant="outline"
                        size="icon"
                        disabled={getTotalParticipants() >= tour.maxGroupSize}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-4 border-b border-gray-200">
                    <div>
                      <Typography as="div" className="font-medium text-gray-900">Trẻ em</Typography>
                      <Typography as="div" className="text-sm text-gray-600">Từ 2-11 tuổi</Typography>
                      <Typography as="div" className="text-sm font-medium text-primary-600">
                        {formatPrice(tour.discountPrice?.child || tour.price.child)}
                      </Typography>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Button
                        onClick={() => handleParticipantChange('children', Math.max(0, participants.children - 1))}
                        variant="outline"
                        size="icon"
                      >
                        -
                      </Button>
                      <Typography as="span" className="w-8 text-center font-medium">{participants.children}</Typography>
                      <Button
                        onClick={() => handleParticipantChange('children', participants.children + 1)}
                        variant="outline"
                        size="icon"
                        disabled={getTotalParticipants() >= tour.maxGroupSize}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-4">
                    <div>
                      <Typography as="div" className="font-medium text-gray-900">Em bé</Typography>
                      <Typography as="div" className="text-sm text-gray-600">Dưới 2 tuổi</Typography>
                      <Typography as="div" className="text-sm font-medium text-primary-600">
                        {formatPrice(tour.discountPrice?.infant || tour.price.infant)}
                      </Typography>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Button
                        onClick={() => handleParticipantChange('infants', Math.max(0, participants.infants - 1))}
                        variant="outline"
                        size="icon"
                      >
                        -
                      </Button>
                      <Typography as="span" className="w-8 text-center font-medium">{participants.infants}</Typography>
                      <Button
                        onClick={() => handleParticipantChange('infants', participants.infants + 1)}
                        variant="outline"
                        size="icon"
                        disabled={getTotalParticipants() >= tour.maxGroupSize}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <Typography className="text-sm text-gray-600">
                    Tổng số khách: {getTotalParticipants()} người
                    <br />
                    Số khách tối thiểu: {tour.minGroupSize} người
                    <br />
                    Số khách tối đa: {tour.maxGroupSize} người
                  </Typography>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Contact Information */}
          {currentStep === 2 && (
            <div>
              <Typography variant="h2" className="text-gray-900 mb-6">Thông tin liên hệ</Typography>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ và tên *
                  </Label>
                  <Input
                    type="text"
                    value={contactInfo.fullName}
                    onChange={(e) => setContactInfo({...contactInfo, fullName: e.target.value})}
                    className="w-full"
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
                    className="w-full"
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
                    className="w-full"
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
                    className="w-full"
                    placeholder="Nhập địa chỉ"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Participant Details */}
          {currentStep === 3 && (
            <div>
              <Typography variant="h2" className="text-gray-900 mb-6">Thông tin khách tham gia</Typography>
              <div className="space-y-6">
                {participantDetails.map((participant, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <Typography variant="h3" className="text-gray-900 mb-4">
                      {participant.type === 'adult' ? 'Người lớn' : 
                       participant.type === 'child' ? 'Trẻ em' : 'Em bé'} #{index + 1}
                    </Typography>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="block text-sm font-medium text-gray-700 mb-2">
                          Họ và tên *
                        </Label>
                        <Input
                          type="text"
                          value={participant.fullName}
                          onChange={(e) => handleParticipantDetailChange(index, 'fullName', e.target.value)}
                          className="w-full"
                          placeholder="Nhập họ và tên"
                        />
                      </div>
                      <div>
                        <Label className="block text-sm font-medium text-gray-700 mb-2">
                          Ngày sinh *
                        </Label>
                        <DatePicker
                          value={participant.dateOfBirth}
                          onChange={(value) => handleParticipantDetailChange(index, 'dateOfBirth', value)}
                          placeholder="Chọn ngày sinh"
                        />
                      </div>
                      <div>
                        <Label className="block text-sm font-medium text-gray-700 mb-2">
                          Giới tính
                        </Label>
                        <Select value={participant.gender} onValueChange={(value) => handleParticipantDetailChange(index, 'gender', value)}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Chọn giới tính" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Nam</SelectItem>
                            <SelectItem value="female">Nữ</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="block text-sm font-medium text-gray-700 mb-2">
                          CMND/CCCD *
                        </Label>
                        <Input
                          type="text"
                          value={participant.identityCard}
                          onChange={(e) => handleParticipantDetailChange(index, 'identityCard', e.target.value)}
                          className="w-full"
                          placeholder="Nhập số CMND/CCCD"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Special Requests & Confirmation */}
          {currentStep === 4 && (
            <div>
              <Typography variant="h2" className="text-gray-900 mb-6">Yêu cầu đặc biệt & Xác nhận</Typography>
              
              <div className="mb-6">
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

              {/* Booking Summary */}
              <div className="bg-gray-50 rounded-lg p-6">
                <Typography variant="h3" className="text-gray-900 mb-4">Tóm tắt đặt tour</Typography>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <Typography as="span" className="text-gray-600">Tour:</Typography>
                    <Typography as="span" className="font-medium">{tour.title}</Typography>
                  </div>
                  <div className="flex justify-between">
                    <Typography as="span" className="text-gray-600">Ngày khởi hành:</Typography>
                    <Typography as="span" className="font-medium">{formatDate(selectedDate)}</Typography>
                  </div>
                  <div className="flex justify-between">
                    <Typography as="span" className="text-gray-600">Số khách:</Typography>
                    <Typography as="span" className="font-medium">{getTotalParticipants()} người</Typography>
                  </div>
                  <div className="flex justify-between">
                    <Typography as="span" className="text-gray-600">Người liên hệ:</Typography>
                    <Typography as="span" className="font-medium">{contactInfo.fullName}</Typography>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <Typography as="span" className="text-gray-900 font-semibold">Tổng tiền:</Typography>
                      <Typography as="span" className="text-primary-600 font-bold text-lg">
                        {formatPrice(calculateTotalPrice())}
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex">
                  <svg className="w-5 h-5 text-blue-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div className="text-sm text-blue-800">
                    <Typography as="p" className="font-medium mb-1">Lưu ý quan trọng:</Typography>
                    <ul className="list-disc list-inside space-y-1">
                      <li><Typography as="span">Vui lòng kiểm tra kỹ thông tin trước khi xác nhận</Typography></li>
                      <li><Typography as="span">Sau khi đặt tour, bạn sẽ nhận được email xác nhận</Typography></li>
                      <li><Typography as="span">Mọi thay đổi cần liên hệ hotline: 1900 1234</Typography></li>
                    </ul>
                  </div>
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
                  size="lg"
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
                  size="lg"
                >
                  Tiếp tục
                </Button>
              ) : (
                <Button
                  onClick={handleBookingSubmit}
                  disabled={isProcessing}
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang xử lý...
                    </>
                  ) : (
                    'Xác nhận đặt tour'
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar - Tour Summary */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
          <Typography variant="h3" className="text-gray-900 mb-4">Chi tiết tour</Typography>
          
          <div className="space-y-3 text-sm">
            <div>
              <Typography variant="h4" className="text-gray-900">{tour.title}</Typography>
              <Typography variant="muted" as="p">{tour.duration.days} ngày {tour.duration.nights} đêm</Typography>
            </div>
            
            {selectedDate && (
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between mb-2">
                  <Typography as="span" className="text-gray-600">Ngày khởi hành:</Typography>
                </div>
                <Typography as="div" className="font-medium text-gray-900">{formatDate(selectedDate)}</Typography>
              </div>
            )}

            <div className="pt-3 border-t border-gray-200">
              <Typography variant="h5" className="text-gray-900 mb-2">Chi tiết giá</Typography>
              
              {participants.adults > 0 && (
                <div className="flex justify-between">
                  <Typography as="span" className="text-gray-600">Người lớn x {participants.adults}</Typography>
                  <Typography as="span" className="text-gray-900">
                    {formatPrice((tour.discountPrice?.adult || tour.price.adult) * participants.adults)}
                  </Typography>
                </div>
              )}
              
              {participants.children > 0 && (
                <div className="flex justify-between">
                  <Typography as="span" className="text-gray-600">Trẻ em x {participants.children}</Typography>
                  <Typography as="span" className="text-gray-900">
                    {formatPrice((tour.discountPrice?.child || tour.price.child) * participants.children)}
                  </Typography>
                </div>
              )}
              
              {participants.infants > 0 && (
                <div className="flex justify-between">
                  <Typography as="span" className="text-gray-600">Em bé x {participants.infants}</Typography>
                  <Typography as="span" className="text-gray-900">
                    {formatPrice((tour.discountPrice?.infant || tour.price.infant) * participants.infants)}
                  </Typography>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <Typography as="span" className="text-lg font-bold text-gray-900">Tổng cộng</Typography>
                <Typography as="span" className="text-xl font-bold text-primary-600">
                  {formatPrice(calculateTotalPrice())}
                </Typography>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <Typography variant="h4" className="text-gray-900 mb-2">Cần hỗ trợ?</Typography>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <Typography as="span">1900 1234</Typography>
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <Typography as="span">info@vilandtravel.vn</Typography>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
