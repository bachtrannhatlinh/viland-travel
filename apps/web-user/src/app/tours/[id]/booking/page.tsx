import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import TourBookingForm from './components/TourBookingForm'

// Mock data - sẽ thay thế bằng API call thực tế
const mockTourData = {
  id: '1',
  title: 'Tour Hạ Long 3 ngày 2 đêm',
  duration: { days: 3, nights: 2 },
  price: {
    adult: 2500000,
    child: 1875000,
    infant: 500000,
    currency: 'VND'
  },
  discountPrice: {
    adult: 2200000,
    child: 1650000,
    infant: 400000
  },
  availability: [
    {
      startDate: '2025-08-15',
      endDate: '2025-08-17',
      availableSlots: 15,
      isAvailable: true
    },
    {
      startDate: '2025-08-22',
      endDate: '2025-08-24',
      availableSlots: 8,
      isAvailable: true
    },
    {
      startDate: '2025-08-29',
      endDate: '2025-08-31',
      availableSlots: 20,
      isAvailable: true
    }
  ],
  maxGroupSize: 25,
  minGroupSize: 4
}

interface TourBookingPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: TourBookingPageProps): Promise<Metadata> {
  return {
    title: `Đặt tour - ${mockTourData.title} - ViLand Travel`,
    description: `Đặt tour ${mockTourData.title} với giá ưu đãi`,
  }
}

export default function TourBookingPage({ params }: TourBookingPageProps) {
  // Trong thực tế sẽ fetch data từ API dựa trên params.id
  const tour = mockTourData
  
  if (!tour) {
    notFound()
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
  )
}
