'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Typography } from '@/components/ui/typography'
import { Card, CardContent } from '@/components/ui/card'
import { Section } from '@/components/ui/section'

export default function FlightFlowTestPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [testData, setTestData] = useState({
    searchParams: {
      from: 'SGN',
      to: 'HAN', 
      departureDate: '2025-08-15',
      adults: 1,
      children: 0,
      infants: 0,
      class: 'economy',
      tripType: 'one-way'
    },
    selectedFlight: null,
    bookingData: null,
    paymentData: null
  })

  const testStep1_FlightSearch = () => {
    // Test tìm chuyến bay
    const queryParams = new URLSearchParams({
      from: testData.searchParams.from,
      to: testData.searchParams.to,
      departureDate: testData.searchParams.departureDate,
      adults: testData.searchParams.adults.toString(),
      children: testData.searchParams.children.toString(),
      infants: testData.searchParams.infants.toString(),
      class: testData.searchParams.class,
      tripType: testData.searchParams.tripType
    })

    // Mở trang tìm kiếm
    window.open(`/flights/search?${queryParams.toString()}`, '_blank')
    setStep(2)
  }

  const testStep2_SelectFlight = () => {
    // Giả lập việc chọn chuyến bay
    const mockSelectedFlight = {
      flight: {
        id: '1',
        flightNumber: 'VN123',
        airline: 'Vietnam Airlines',
        departureAirport: 'SGN',
        arrivalAirport: 'HAN',
        departureDate: '2025-08-15T06:00:00Z',
        arrivalDate: '2025-08-15T08:15:00Z',
        pricing: {
          economy: { price: 2500000, available: 50 }
        }
      },
      searchCriteria: testData.searchParams,
      selectedClass: 'economy'
    }

    // Lưu vào sessionStorage như thật
    sessionStorage.setItem('selectedFlight', JSON.stringify(mockSelectedFlight))
    
    // Mở trang booking
    window.open('/flights/booking', '_blank')
    setStep(3)
  }

  const testStep3_BookingForm = () => {
    // Giả lập việc điền form đặt vé
    const mockBookingData = {
      flight: {
        id: '1',
        flightNumber: 'VN123',
        airline: 'Vietnam Airlines',
        departureAirport: 'SGN',
        arrivalAirport: 'HAN',
        departureDate: '2025-08-15T06:00:00Z',
        arrivalDate: '2025-08-15T08:15:00Z',
        pricing: {
          economy: { price: 2500000, available: 50 }
        }
      },
      passengers: [{
        type: 'adult',
        title: 'Mr',
        firstName: 'Nguyen',
        lastName: 'Van A',
        dateOfBirth: '1990-01-01',
        nationality: 'VN'
      }],
      contactInfo: {
        name: 'Nguyen Van A',
        email: 'test@example.com',
        phone: '0901234567',
        address: 'TP HCM'
      },
      selectedClass: 'economy',
      totalPrice: 2500000
    }

    // Lưu vào sessionStorage
    sessionStorage.setItem('flightBookingData', JSON.stringify(mockBookingData))
    
    // Mở trang payment
    window.open('/flights/payment', '_blank')
    setStep(4)
  }

  const testStep4_Payment = () => {
    alert('✅ Hoàn thành test flow thanh toán!')
    setStep(1)
  }

  const testAPIDirectly = async () => {
    try {
      const response = await fetch('/api/flights/search?from=SGN&to=HAN&departureDate=2025-08-15&adults=1&children=0&infants=0&class=economy')
      const data = await response.json()
      console.log('API Response:', data)
      alert('✅ API hoạt động tốt! Check console để xem data')
    } catch (error) {
      console.error('API Error:', error)
      alert('❌ Lỗi API: ' + (error as Error).message)
    }
  }

  return (
    <Section className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Typography variant="h1" className="text-3xl font-bold mb-8 text-center">
          🧪 Test Flow: Vé máy bay → Tìm chuyến → Đặt vé → Thanh toán
        </Typography>

        <Card className="mb-6">
          <CardContent className="p-6">
            <Typography variant="h2" className="text-xl font-semibold mb-4">Current Flow Status:</Typography>
            <div className="flex items-center space-x-4">
              <div className={`px-4 py-2 rounded ${step >= 1 ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
                1. Vé máy bay
              </div>
              <Typography variant="small">→</Typography>
              <div className={`px-4 py-2 rounded ${step >= 2 ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
                2. Tìm chuyến
              </div>
              <Typography variant="small">→</Typography>
              <div className={`px-4 py-2 rounded ${step >= 3 ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
                3. Đặt vé
              </div>
              <Typography variant="small">→</Typography>
              <div className={`px-4 py-2 rounded ${step >= 4 ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
                4. Thanh toán
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <Typography variant="h3" className="text-lg font-semibold mb-4">🔍 Step 1: Test Search Flow</Typography>
              <Typography variant="p" className="text-gray-600 mb-4">Test trang tìm kiếm chuyến bay với params: SGN → HAN, 15/08/2025</Typography>
              <Button onClick={testStep1_FlightSearch}>
                Test Tìm chuyến bay
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <Typography variant="h3" className="text-lg font-semibold mb-4">✈️ Step 2: Test Booking Flow</Typography>
              <Typography variant="p" className="text-gray-600 mb-4">Giả lập việc chọn chuyến bay và chuyển đến trang đặt vé</Typography>
              <Button onClick={testStep2_SelectFlight} className="bg-green-600 hover:bg-green-700">
                Test Chọn chuyến bay
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <Typography variant="h3" className="text-lg font-semibold mb-4">📝 Step 3: Test Payment Flow</Typography>
              <Typography variant="p" className="text-gray-600 mb-4">Giả lập việc điền form và chuyển đến thanh toán</Typography>
              <Button onClick={testStep3_BookingForm} className="bg-orange-600 hover:bg-orange-700">
                Test Đặt vé
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <Typography variant="h3" className="text-lg font-semibold mb-4">💳 Step 4: Complete Flow</Typography>
              <Typography variant="p" className="text-gray-600 mb-4">Hoàn thành flow thanh toán</Typography>
              <Button onClick={testStep4_Payment} className="bg-purple-600 hover:bg-purple-700">
                Test Thanh toán
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <Typography variant="h3" className="text-lg font-semibold mb-4">🔧 Test API Directly</Typography>
              <Typography variant="p" className="text-gray-600 mb-4">Test API search trực tiếp</Typography>
              <Button onClick={testAPIDirectly} variant="secondary">
                Test API Search
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8 bg-blue-50 border border-blue-200">
          <CardContent className="p-4">
            <Typography variant="h4" className="font-semibold text-blue-800 mb-2">📋 Hướng dẫn test:</Typography>
            <ol className="list-decimal list-inside text-blue-700 space-y-1">
              <li>Click &quot;Test Tìm chuyến bay&quot; → sẽ mở tab mới với kết quả search</li>
              <li>Click &quot;Test Chọn chuyến bay&quot; → sẽ mở trang booking với data giả lập</li>
              <li>Click &quot;Test Đặt vé&quot; → sẽ mở trang payment với booking data</li>
              <li>Click &quot;Test API Search&quot; → kiểm tra API có hoạt động không</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </Section>
  )
}
