'use client'

import FlightFilters from '@/components/flights/FlightFilters'
import FlightCard from '@/components/flights/FlightCard'
import { Flight, FlightClass } from '@/types/flight.types'

const testFlight: Flight = {
  id: '1',
  flightNumber: 'VN123',
  airline: 'Vietnam Airlines',
  aircraftType: 'A321',
  departureAirport: 'SGN',
  arrivalAirport: 'HAN',
  departureCity: 'TP. Hồ Chí Minh',
  arrivalCity: 'Hà Nội',
  departureDate: '2025-08-15T06:00:00Z',
  arrivalDate: '2025-08-15T08:15:00Z',
  duration: 135,
  pricing: {
    economy: { available: 50, price: 2500000, originalPrice: 2800000 },
    business: { available: 10, price: 5500000, originalPrice: 6000000 }
  },
  status: 'scheduled',
  type: 'domestic',
  isDirect: true,
  formattedDuration: '2h 15m',
  rating: 4.5,
  amenities: ['Wifi', 'Meal', 'Entertainment']
}

export default function TestPage() {
  const handleFlightSelect = (flight: Flight) => {
    console.log('Selected flight:', flight)
  }

  const handleFilterChange = (filters: any) => {
    console.log('Filter changed:', filters)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Component Test Page</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <FlightFilters 
              flights={[testFlight]}
              onFilterChange={handleFilterChange}
            />
          </div>
          
          <div className="lg:col-span-3">
            <FlightCard 
              flight={testFlight}
              onSelect={handleFlightSelect}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
