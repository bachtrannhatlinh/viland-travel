import { PassengerInfo } from '@/types/flight.types'

interface PassengerFormProps {
  passengers: PassengerInfo[]
  onPassengerChange: (index: number, passenger: PassengerInfo) => void
  onAddPassenger: () => void
  onRemovePassenger: (index: number) => void
}

export default function PassengerForm({ 
  passengers, 
  onPassengerChange, 
  onAddPassenger, 
  onRemovePassenger 
}: PassengerFormProps) {

  const handlePassengerUpdate = (index: number, field: keyof PassengerInfo, value: string) => {
    const updatedPassenger = { ...passengers[index], [field]: value }
    onPassengerChange(index, updatedPassenger)
  }

  return (
    <div className="space-y-6">
      {passengers.map((passenger, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-lg">
              Hành khách {index + 1}
            </h4>
            {passengers.length > 1 && (
              <button
                onClick={() => onRemovePassenger(index)}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                Xóa hành khách
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Passenger Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại hành khách *
              </label>
              <select
                value={passenger.type}
                onChange={(e) => handlePassengerUpdate(index, 'type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                required
              >
                <option value="adult">Người lớn (12+)</option>
                <option value="child">Trẻ em (2-11)</option>
                <option value="infant">Em bé (&lt;2)</option>
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Danh xưng *
              </label>
              <select
                value={passenger.title}
                onChange={(e) => handlePassengerUpdate(index, 'title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                required
              >
                <option value="">Chọn danh xưng</option>
                <option value="Mr">Ông</option>
                <option value="Ms">Bà</option>
                <option value="Mrs">Cô</option>
                <option value="Master">Bé trai</option>
                <option value="Miss">Bé gái</option>
              </select>
            </div>

            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên *
              </label>
              <input
                type="text"
                value={passenger.firstName}
                onChange={(e) => handlePassengerUpdate(index, 'firstName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                placeholder="Nhập tên"
                required
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Họ *
              </label>
              <input
                type="text"
                value={passenger.lastName}
                onChange={(e) => handlePassengerUpdate(index, 'lastName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                placeholder="Nhập họ"
                required
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày sinh *
              </label>
              <input
                type="date"
                value={passenger.dateOfBirth}
                onChange={(e) => handlePassengerUpdate(index, 'dateOfBirth', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>

            {/* Nationality */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quốc tịch *
              </label>
              <select
                value={passenger.nationality}
                onChange={(e) => handlePassengerUpdate(index, 'nationality', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                required
              >
                <option value="VN">Việt Nam</option>
                <option value="US">Hoa Kỳ</option>
                <option value="GB">Anh</option>
                <option value="FR">Pháp</option>
                <option value="DE">Đức</option>
                <option value="JP">Nhật Bản</option>
                <option value="KR">Hàn Quốc</option>
                <option value="CN">Trung Quốc</option>
                <option value="TH">Thái Lan</option>
                <option value="SG">Singapore</option>
                <option value="MY">Malaysia</option>
                <option value="AU">Úc</option>
              </select>
            </div>

            {/* Passport Number - For international flights */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số hộ chiếu
              </label>
              <input
                type="text"
                value={passenger.passportNumber || ''}
                onChange={(e) => handlePassengerUpdate(index, 'passportNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                placeholder="Chỉ cần cho chuyến bay quốc tế"
              />
            </div>

            {/* Passport Expiry - For international flights */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày hết hạn hộ chiếu
              </label>
              <input
                type="date"
                value={passenger.passportExpiry || ''}
                onChange={(e) => handlePassengerUpdate(index, 'passportExpiry', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Email - Optional for additional passengers */}
            {index === 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={passenger.email || ''}
                  onChange={(e) => handlePassengerUpdate(index, 'email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Email của hành khách chính"
                />
              </div>
            )}

            {/* Phone - Optional for additional passengers */}
            {index === 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  value={passenger.phone || ''}
                  onChange={(e) => handlePassengerUpdate(index, 'phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Số điện thoại của hành khách chính"
                />
              </div>
            )}
          </div>

          {/* Important Notes */}
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex">
              <svg className="w-5 h-5 text-yellow-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div className="text-sm text-yellow-800">
                <p className="font-medium">Lưu ý quan trọng:</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Tên phải khớp chính xác với giấy tờ tùy thân</li>
                  <li>Với chuyến bay quốc tế, hộ chiếu phải còn hiệu lực ít nhất 6 tháng</li>
                  <li>Trẻ em dưới 2 tuổi cần ngồi cùng người lớn</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Add Passenger Button */}
      <div className="text-center">
        <button
          onClick={onAddPassenger}
          className="btn-secondary px-6 py-3 inline-flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Thêm hành khách
        </button>
      </div>
    </div>
  )
}
