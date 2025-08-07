import { Mail, Phone, Send } from 'lucide-react'

export function PartnersAndContact() {
  const partners = [
    { name: 'Vietnam Airlines', logo: '/images/partners/vietnam-airlines.png' },
    { name: 'Jetstar', logo: '/images/partners/jetstar.png' },
    { name: 'Bamboo Airways', logo: '/images/partners/bamboo.png' },
    { name: 'Agoda', logo: '/images/partners/agoda.png' },
    { name: 'Booking.com', logo: '/images/partners/booking.png' },
    { name: 'Expedia', logo: '/images/partners/expedia.png' },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Partners */}
          <div>
            <div className="text-center lg:text-left mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Đối tác của chúng tôi
              </h2>
              <p className="text-gray-600">
                Hợp tác với những thương hiệu hàng đầu để mang đến dịch vụ tốt nhất
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              {partners.map((partner, index) => (
                <div key={index} className="flex items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                  {/* Placeholder for partner logo */}
                  <div className="w-24 h-12 bg-gray-300 rounded flex items-center justify-center">
                    <span className="text-xs text-gray-600 text-center px-2">
                      {partner.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center lg:text-left">
              <p className="text-gray-600 mb-4">
                Và hơn 500+ đối tác khác trên toàn thế giới
              </p>
              <a href="/partners" className="text-primary-600 hover:text-primary-700 font-medium">
                Xem tất cả đối tác →
              </a>
            </div>
          </div>

          {/* Quick Contact Form */}
          <div>
            <div className="text-center lg:text-left mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Liên hệ nhanh
              </h2>
              <p className="text-gray-600">
                Gửi thông tin để chúng tôi tư vấn cho bạn những gói tour phù hợp nhất
              </p>
            </div>

            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Họ và tên *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Nhập họ và tên của bạn"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="0987654321"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
                  Dịch vụ quan tâm
                </label>
                <select
                  id="service"
                  name="service"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Chọn dịch vụ</option>
                  <option value="tour">Tour du lịch</option>
                  <option value="flight">Vé máy bay</option>
                  <option value="hotel">Khách sạn</option>
                  <option value="car">Thuê xe</option>
                  <option value="driver">Go_Safe Driver</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Tin nhắn
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Nhập yêu cầu cụ thể của bạn..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full btn-primary flex items-center justify-center"
              >
                <Send className="h-4 w-4 mr-2" />
                Gửi liên hệ
              </button>
            </form>

            <div className="mt-8 p-4 bg-primary-50 rounded-lg">
              <h4 className="font-semibold text-primary-900 mb-3">
                Hoặc liên hệ trực tiếp:
              </h4>
              <div className="space-y-2">
                <div className="flex items-center text-primary-700">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>Hotline: 1900 1234</span>
                </div>
                <div className="flex items-center text-primary-700">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>Email: info@gosafe.vn</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
