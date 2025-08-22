// API call to get booking confirmation by code
import { apiClient } from '@/lib/utils'
import { FlightBookingData } from '@/types/flight.types'

export async function fetchFlightBookingConfirmation(confirmationCode: string): Promise<FlightBookingData | null> {
  if (!confirmationCode) return null
  try {
    // Đổi endpoint cho đúng với backend của bạn
    const data = await apiClient.get(`/bookings/confirmation/${confirmationCode}`)
    if (data && data.success !== false) {
      return data
    }
    return null
  } catch (err) {
    return null
  }
}
