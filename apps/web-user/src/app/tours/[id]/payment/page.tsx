import { Metadata } from 'next'
import TourPaymentForm from './components/TourPaymentForm'

export const metadata: Metadata = {
  title: 'Thanh toán tour - ViLand Travel',
  description: 'Hoàn tất thanh toán đặt tour với các phương thức thanh toán an toàn',
}

export default function TourPaymentPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full text-sm font-semibold">
                ✓
              </div>
              <span className="ml-2 text-sm font-medium text-green-600">Chọn tour</span>
            </div>
            <div className="flex-1 h-0.5 bg-green-500 mx-4"></div>
            <div className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full text-sm font-semibold">
                ✓
              </div>
              <span className="ml-2 text-sm font-medium text-green-600">Đặt tour</span>
            </div>
            <div className="flex-1 h-0.5 bg-primary-600 mx-4"></div>
            <div className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 bg-primary-600 text-white rounded-full text-sm font-semibold">
                3
              </div>
              <span className="ml-2 text-sm font-medium text-primary-600">Thanh toán</span>
            </div>
          </div>
        </div>

        <TourPaymentForm />
      </div>
    </div>
  )
}
