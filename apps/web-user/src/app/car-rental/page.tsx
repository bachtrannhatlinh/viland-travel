import { Metadata } from 'next'
import CarRentalSearch from './components/CarRentalSearch'

export const metadata: Metadata = {
  title: 'Thuê xe du lịch - ViLand Travel',
  description: 'Dịch vụ thuê xe du lịch an toàn, tiện lợi với đa dạng loại xe. Đặt xe online nhanh chóng, giá cả hợp lý.',
}

export default function CarRentalPage() {
  return <CarRentalSearch />
}
