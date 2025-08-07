import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dịch vụ lái xe Go_Safe - GoSafe',
  description: 'Dịch vụ lái xe chuyên nghiệp, an toàn. Đặt tài xế kinh nghiệm cho chuyến đi của bạn.',
}

export default function DriverServicePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Dịch vụ lái xe Go_Safe
          </h1>
          <p className="text-xl text-gray-600">
            Tài xế chuyên nghiệp, an toàn cho mọi chuyến đi
          </p>
        </div>

        {/* Driver Service Form */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Đặt tài xế</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Điểm đón
              </label>
              <input
                type="text"
                placeholder="Địa chỉ đón"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Điểm đến
              </label>
              <input
                type="text"
                placeholder="Địa chỉ đến"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày sử dụng
              </label>
              <input
                type="date"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thời gian
              </label>
              <input
                type="time"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại dịch vụ
              </label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                <option value="">Chọn loại dịch vụ</option>
                <option value="one-way">Một chiều</option>
                <option value="round-trip">Khứ hồi</option>
                <option value="hourly">Thuê theo giờ</option>
                <option value="daily">Thuê theo ngày</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ghi chú lịch trình
              </label>
              <textarea
                rows={4}
                placeholder="Mô tả chi tiết lịch trình, yêu cầu đặc biệt..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              ></textarea>
            </div>
            <div className="md:col-span-2">
              <button className="w-full btn-primary py-3">
                Đặt tài xế ngay
              </button>
            </div>
          </div>
        </div>

        {/* Service Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            {
              icon: '🛡️',
              title: 'An toàn tuyệt đối',
              description: 'Tài xế được đào tạo chuyên nghiệp, có kinh nghiệm lái xe lâu năm'
            },
            {
              icon: '⭐',
              title: 'Dịch vụ 5 sao',
              description: 'Thái độ phục vụ tận tình, lịch sự, chuyên nghiệp'
            },
            {
              icon: '📍',
              title: 'Đúng giờ cam kết',
              description: 'Luôn đúng giờ hẹn, không để khách hàng phải chờ đợi'
            },
            {
              icon: '💰',
              title: 'Giá cả hợp lý',
              description: 'Mức giá cạnh tranh, minh bạch, không phí ẩn'
            },
            {
              icon: '🚗',
              title: 'Xe đời mới',
              description: 'Đội xe đời mới, được bảo dưỡng thường xuyên'
            },
            {
              icon: '📞',
              title: 'Hỗ trợ 24/7',
              description: 'Hỗ trợ khách hàng mọi lúc, mọi nơi khi cần thiết'
            }
          ].map((feature, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Bảng giá dịch vụ</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-4 px-6 font-semibold text-gray-900">Loại dịch vụ</th>
                  <th className="py-4 px-6 font-semibold text-gray-900">Mô tả</th>
                  <th className="py-4 px-6 font-semibold text-gray-900">Giá</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6">Thuê theo giờ</td>
                  <td className="py-4 px-6">Tối thiểu 4 giờ</td>
                  <td className="py-4 px-6 font-semibold text-primary-600">150,000đ/giờ</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6">Thuê nửa ngày</td>
                  <td className="py-4 px-6">8 giờ sử dụng</td>
                  <td className="py-4 px-6 font-semibold text-primary-600">1,000,000đ</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6">Thuê cả ngày</td>
                  <td className="py-4 px-6">12 giờ sử dụng</td>
                  <td className="py-4 px-6 font-semibold text-primary-600">1,500,000đ</td>
                </tr>
                <tr>
                  <td className="py-4 px-6">Thuê theo tuyến</td>
                  <td className="py-4 px-6">Tùy theo km</td>
                  <td className="py-4 px-6 font-semibold text-primary-600">Liên hệ</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Coming Soon Message */}
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
            <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Hệ thống đặt tài xế đang hoàn thiện
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Chúng tôi đang hoàn thiện hệ thống đặt tài xế online. 
            Hiện tại vui lòng liên hệ trực tiếp để được phục vụ.
          </p>
          <div className="space-x-4">
            <button className="btn-primary">Gọi ngay: 1900 1234</button>
            <button className="btn-secondary">Quay về trang chủ</button>
          </div>
        </div>
      </div>
    </div>
  )
}
