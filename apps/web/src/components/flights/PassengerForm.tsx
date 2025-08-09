import { PassengerInfo } from '@/types/flight.types'
import { DatePicker } from '@/components/ui/date-picker'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Typography } from '@/components/ui/typography'
import { Card, CardContent } from '@/components/ui/card'

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
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <Typography variant="h4" className="font-semibold text-lg">
                Hành khách {index + 1}
              </Typography>
              {passengers.length > 1 && (
                <Button
                  onClick={() => onRemovePassenger(index)}
                  variant="destructive"
                  size="sm"
                >
                  Xóa hành khách
                </Button>
              )}
            </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Passenger Type */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Loại hành khách *
              </Label>
              <Select value={passenger.type} onValueChange={(value) => handlePassengerUpdate(index, 'type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="adult">Người lớn (12+)</SelectItem>
                  <SelectItem value="child">Trẻ em (2-11)</SelectItem>
                  <SelectItem value="infant">Em bé (&lt;2)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Title */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Danh xưng *
              </Label>
              <Select value={passenger.title} onValueChange={(value) => handlePassengerUpdate(index, 'title', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh xưng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mr">Ông</SelectItem>
                  <SelectItem value="Ms">Bà</SelectItem>
                  <SelectItem value="Mrs">Cô</SelectItem>
                  <SelectItem value="Master">Bé trai</SelectItem>
                  <SelectItem value="Miss">Bé gái</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* First Name */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Tên *
              </Label>
              <Input
                type="text"
                value={passenger.firstName}
                onChange={(e) => handlePassengerUpdate(index, 'firstName', e.target.value)}
                placeholder="Nhập tên"
                required
              />
            </div>

            {/* Last Name */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Họ *
              </Label>
              <Input
                type="text"
                value={passenger.lastName}
                onChange={(e) => handlePassengerUpdate(index, 'lastName', e.target.value)}
                placeholder="Nhập họ"
                required
              />
            </div>

            {/* Date of Birth */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày sinh *
              </Label>
              <DatePicker
                value={passenger.dateOfBirth}
                onChange={(value) => handlePassengerUpdate(index, 'dateOfBirth', value)}
                placeholder="Chọn ngày sinh"
              />
            </div>

            {/* Nationality */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Quốc tịch *
              </Label>
              <Select value={passenger.nationality} onValueChange={(value) => handlePassengerUpdate(index, 'nationality', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VN">Việt Nam</SelectItem>
                  <SelectItem value="US">Hoa Kỳ</SelectItem>
                  <SelectItem value="GB">Anh</SelectItem>
                  <SelectItem value="FR">Pháp</SelectItem>
                  <SelectItem value="DE">Đức</SelectItem>
                  <SelectItem value="JP">Nhật Bản</SelectItem>
                  <SelectItem value="KR">Hàn Quốc</SelectItem>
                  <SelectItem value="CN">Trung Quốc</SelectItem>
                  <SelectItem value="TH">Thái Lan</SelectItem>
                  <SelectItem value="SG">Singapore</SelectItem>
                  <SelectItem value="MY">Malaysia</SelectItem>
                  <SelectItem value="AU">Úc</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Passport Number - For international flights */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Số hộ chiếu
              </Label>
              <Input
                type="text"
                value={passenger.passportNumber || ''}
                onChange={(e) => handlePassengerUpdate(index, 'passportNumber', e.target.value)}
                placeholder="Chỉ cần cho chuyến bay quốc tế"
              />
            </div>

            {/* Passport Expiry - For international flights */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày hết hạn hộ chiếu
              </Label>
              <DatePicker
                value={passenger.passportExpiry || ''}
                onChange={(value) => handlePassengerUpdate(index, 'passportExpiry', value)}
                min={new Date().toISOString().split('T')[0]}
                placeholder="Chọn ngày hết hạn hộ chiếu"
              />
            </div>

            {/* Email - Optional for additional passengers */}
            {index === 0 && (
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </Label>
                <Input
                  type="email"
                  value={passenger.email || ''}
                  onChange={(e) => handlePassengerUpdate(index, 'email', e.target.value)}
                  placeholder="Email của hành khách chính"
                />
              </div>
            )}

            {/* Phone - Optional for additional passengers */}
            {index === 0 && (
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại
                </Label>
                <Input
                  type="tel"
                  value={passenger.phone || ''}
                  onChange={(e) => handlePassengerUpdate(index, 'phone', e.target.value)}
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
                <Typography variant="small" className="font-medium">Lưu ý quan trọng:</Typography>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Tên phải khớp chính xác với giấy tờ tùy thân</li>
                  <li>Với chuyến bay quốc tế, hộ chiếu phải còn hiệu lực ít nhất 6 tháng</li>
                  <li>Trẻ em dưới 2 tuổi cần ngồi cùng người lớn</li>
                </ul>
              </div>
            </div>
          </div>
          </CardContent>
        </Card>
      ))}

      {/* Add Passenger Button */}
      <div className="text-center">
        <Button
          onClick={onAddPassenger}
          variant="secondary"
          className="px-6 py-3 inline-flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Thêm hành khách
        </Button>
      </div>
    </div>
  )
}
