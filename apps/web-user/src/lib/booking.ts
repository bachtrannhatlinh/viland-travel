// API call to get booking confirmation by code
import { apiClient } from '@/lib/utils'

// Dùng chung cho xác nhận tour (có thể generic nếu muốn cho flight)
export async function fetchBookingConfirmation(confirmationCode: string): Promise<any | null> {
  if (!confirmationCode) return null
  try {
    const data = await apiClient.get(`/bookings/confirmation/${confirmationCode}`)
    if (data && data.success !== false) {
      return data
    }
    return null
  } catch (err) {
    return null
  }
}
