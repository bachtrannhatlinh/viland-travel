import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Thuê xe du lịch - GoSafe',
  description: 'Dịch vụ thuê xe du lịch an toàn, tiện lợi với đa dạng loại xe. Đặt xe online nhanh chóng, giá cả hợp lý.',
}

export default function CarRentalPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Thuê xe du lịch
          </h1>
          <p className="text-xl text-gray-600">
            Dịch vụ thuê xe an toàn, tiện lợi cho mọi chuyến đi
          </p>
        </div>

        {/* Car Rental Search Form */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Địa điểm nhận xe
              </label>
              <input
                type="text"
                placeholder="Thành phố, sân bay"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày nhận xe
              </label>
              <input
                type="date"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày trả xe
              </label>
              <input
                type="date"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại xe
              </label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                <option value="">Tất cả loại xe</option>
                <option value="4-seat">Xe 4 chỗ</option>
                <option value="7-seat">Xe 7 chỗ</option>
                <option value="16-seat">Xe 16 chỗ</option>
                <option value="29-seat">Xe 29 chỗ</option>
                <option value="45-seat">Xe 45 chỗ</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="w-full btn-primary py-3">
                Tìm xe
              </button>
            </div>
          </div>
        </div>

        {/* Car Types */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            {
              name: 'Xe 4 chỗ',
              description: 'Phù hợp cho gia đình nhỏ, cặp đôi',
              price: 'Từ 800,000đ/ngày',
              features: ['Tiết kiệm nhiên liệu', 'Dễ dàng di chuyển', 'Giá cả hợp lý']
            },
            {
              name: 'Xe 7 chỗ',
              description: 'Lý tưởng cho gia đình, nhóm bạn',
              price: 'Từ 1,200,000đ/ngày',
              features: ['Rộng rãi thoải mái', 'An toàn cao', 'Phù hợp đường dài']
            },
            {
              name: 'Xe 16 chỗ',
              description: 'Phù hợp cho đoàn du lịch nhỏ',
              price: 'Từ 2,000,000đ/ngày',
              features: ['Tiện lợi cho đoàn', 'Có hành lý lớn', 'Tài xế kinh nghiệm']
            }
          ].map((car, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{car.name}</h3>
              <p className="text-gray-600 mb-4">{car.description}</p>
              <div className="text-2xl font-bold text-primary-600 mb-4">{car.price}</div>
              <ul className="space-y-2 mb-6">
                {car.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="w-full btn-secondary">Đặt xe ngay</button>
            </div>
          ))}
        </div>

        {/* Coming Soon Message */}
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
            <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Hệ thống đặt xe đang hoàn thiện
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Chúng tôi đang hoàn thiện hệ thống đặt xe online để mang đến trải nghiệm tốt nhất. 
            Hiện tại vui lòng liên hệ trực tiếp để đặt xe.
          </p>
          <div className="space-x-4">
            <button className="btn-primary">Liên hệ đặt xe</button>
            <button className="btn-secondary">Quay về trang chủ</button>
          </div>
        </div>
      </div>
    </div>
  )
}
