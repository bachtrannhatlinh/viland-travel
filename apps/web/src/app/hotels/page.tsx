import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Booking khách sạn - GoSafe',
  description: 'Đặt phòng khách sạn chất lượng với giá tốt nhất. Tìm kiếm và so sánh hàng nghìn khách sạn trên toàn quốc.',
}

export default function HotelsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Booking khách sạn
          </h1>
          <p className="text-xl text-gray-600">
            Tìm kiếm và đặt phòng khách sạn với giá tốt nhất
          </p>
        </div>

        {/* Hotel Search Form */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Điểm đến
              </label>
              <input
                type="text"
                placeholder="Thành phố, khách sạn"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày nhận phòng
              </label>
              <input
                type="date"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày trả phòng
              </label>
              <input
                type="date"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số phòng & khách
              </label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                <option value="1-2">1 phòng, 2 khách</option>
                <option value="1-3">1 phòng, 3 khách</option>
                <option value="2-4">2 phòng, 4 khách</option>
                <option value="custom">Tùy chọn khác</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="w-full btn-primary py-3">
                Tìm khách sạn
              </button>
            </div>
          </div>
        </div>

        {/* Coming Soon Message */}
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
            <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Hệ thống booking đang phát triển
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Chúng tôi đang hoàn thiện hệ thống booking khách sạn để mang đến trải nghiệm tốt nhất. 
            Vui lòng liên hệ để được hỗ trợ đặt phòng.
          </p>
          <div className="space-x-4">
            <button className="btn-primary">Liên hệ đặt phòng</button>
            <button className="btn-secondary">Quay về trang chủ</button>
          </div>
        </div>
      </div>
    </div>
  )
}
