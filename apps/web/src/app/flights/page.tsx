import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Vé máy bay giá rẻ - GoSafe',
  description: 'Đặt vé máy bay giá rẻ đến mọi điểm đến trên thế giới. Tìm kiếm và so sánh giá vé từ các hãng hàng không hàng đầu.',
}

export default function FlightsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Vé máy bay giá rẻ
          </h1>
          <p className="text-xl text-gray-600">
            Tìm kiếm và đặt vé máy bay đến mọi điểm đến trên thế giới
          </p>
        </div>

        {/* Flight Search Form */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Từ
              </label>
              <input
                type="text"
                placeholder="Thành phố đi"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Đến
              </label>
              <input
                type="text"
                placeholder="Thành phố đến"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày bay
              </label>
              <input
                type="date"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-end">
              <button className="w-full btn-primary py-3">
                Tìm chuyến bay
              </button>
            </div>
          </div>
        </div>

        {/* Coming Soon Message */}
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
            <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Tính năng đang phát triển
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Chúng tôi đang hoàn thiện tính năng tìm kiếm và đặt vé máy bay. 
            Vui lòng quay lại sau hoặc liên hệ để được hỗ trợ.
          </p>
          <div className="space-x-4">
            <button className="btn-primary">Liên hệ tư vấn</button>
            <button className="btn-secondary">Quay về trang chủ</button>
          </div>
        </div>
      </div>
    </div>
  )
}
