import { NextRequest, NextResponse } from 'next/server'

// Mock flight data - in production this would call the backend API
const mockFlights = [
  {
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
  },
  {
    id: '2',
    flightNumber: 'VJ456',
    airline: 'VietJet Air',
    aircraftType: 'A320',
    departureAirport: 'SGN',
    arrivalAirport: 'HAN',
    departureCity: 'TP. Hồ Chí Minh',
    arrivalCity: 'Hà Nội',
    departureDate: '2025-08-15T08:30:00Z',
    arrivalDate: '2025-08-15T10:45:00Z',
    duration: 135,
    pricing: {
      economy: { available: 75, price: 1950000 },
      premium_economy: { available: 20, price: 2800000 }
    },
    status: 'scheduled',
    type: 'domestic',
    isDirect: true,
    formattedDuration: '2h 15m',
    rating: 4.2,
    amenities: ['Wifi', 'Light Meal']
  },
  {
    id: '3',
    flightNumber: 'JQ789',
    airline: 'Jetstar Pacific',
    aircraftType: 'A320',
    departureAirport: 'SGN',
    arrivalAirport: 'HAN',
    departureCity: 'TP. Hồ Chí Minh',
    arrivalCity: 'Hà Nội',
    departureDate: '2025-08-15T14:20:00Z',
    arrivalDate: '2025-08-15T16:35:00Z',
    duration: 135,
    pricing: {
      economy: { available: 45, price: 1750000 }
    },
    status: 'scheduled',
    type: 'domestic',
    isDirect: true,
    formattedDuration: '2h 15m',
    rating: 4.0,
    amenities: ['Wifi']
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const from = searchParams.get('from') || ''
    const to = searchParams.get('to') || ''
    const departureDate = searchParams.get('departureDate') || ''
    const returnDate = searchParams.get('returnDate')
    const adults = parseInt(searchParams.get('adults') || '1')
    const children = parseInt(searchParams.get('children') || '0')
    const infants = parseInt(searchParams.get('infants') || '0')
    const flightClass = searchParams.get('class') || 'economy'

    // Simple filtering based on departure/arrival cities
    let filteredFlights = mockFlights

    if (from && to) {
      filteredFlights = mockFlights.filter(flight => 
        flight.departureCity.toLowerCase().includes(from.toLowerCase()) &&
        flight.arrivalCity.toLowerCase().includes(to.toLowerCase())
      )
    }

    // Add mock return flights if round trip
    if (returnDate) {
      const returnFlights = filteredFlights.map(flight => ({
        ...flight,
        id: flight.id + '_return',
        flightNumber: flight.flightNumber.replace(/\d+/, (match) => (parseInt(match) + 100).toString()),
        departureAirport: flight.arrivalAirport,
        arrivalAirport: flight.departureAirport,
        departureCity: flight.arrivalCity,
        arrivalCity: flight.departureCity,
        departureDate: returnDate + 'T14:00:00Z',
        arrivalDate: returnDate + 'T16:15:00Z'
      }))
      
      filteredFlights = [...filteredFlights, ...returnFlights]
    }

    return NextResponse.json({
      success: true,
      data: {
        flights: filteredFlights,
        totalCount: filteredFlights.length,
        searchParams: { from, to, departureDate, returnDate, adults, children, infants, flightClass },
        filters: {
          airlines: Array.from(new Set(filteredFlights.map(f => f.airline))),
          priceRange: {
            min: Math.min(...filteredFlights.map(f => f.pricing.economy.price)),
            max: Math.max(...filteredFlights.map(f => f.pricing.economy.price))
          }
        }
      },
      message: 'Flight search completed successfully'
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Error searching flights',
      error: error
    }, { status: 500 })
  }
}
