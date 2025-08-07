'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Flight, FlightSearchParams, FlightClass } from '@/types/flight.types'
import dynamic from 'next/dynamic'

// Lazy load components để tránh SSR issues
const FlightCard = dynamic(() => import('@/components/flights/FlightCard'), { ssr: false })
const FlightFilters = dynamic(() => import('@/components/flights/FlightFilters'), { ssr: false })

export default function FlightSearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [flights, setFlights] = useState<Flight[]>([])
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchCriteria, setSearchCriteria] = useState<FlightSearchParams | null>(null)

  useEffect(() => {
    // Parse search parameters
    const from = searchParams.get('from') || ''
    const to = searchParams.get('to') || ''
    const departureDate = searchParams.get('departureDate') || ''
    const returnDate = searchParams.get('returnDate') || ''
    const adults = parseInt(searchParams.get('adults') || '1')
    const children = parseInt(searchParams.get('children') || '0')
    const infants = parseInt(searchParams.get('infants') || '0')
    const flightClass = (searchParams.get('class') || FlightClass.ECONOMY) as FlightClass
    const tripType = (searchParams.get('tripType') || 'one-way') as 'one-way' | 'round-trip'

    setSearchCriteria({
      from,
      to,
      departureDate,
      returnDate,
      passengers: { adults, children, infants },
      flightClass,
      tripType
    })

    // Call API to search flights
    const searchFlights = async () => {
      try {
        const queryParams = new URLSearchParams({
          from,
          to,
          departureDate,
          adults: adults.toString(),
          children: children.toString(),
          infants: infants.toString(),
          class: flightClass,
          ...(returnDate && { returnDate })
        })

        const response = await fetch(`/api/flights/search?${queryParams.toString()}`)
        const data = await response.json()

        if (data.success) {
          setFlights(data.data.flights)
          setFilteredFlights(data.data.flights)
        } else {
          console.error('Error searching flights:', data.message)
          setFlights([])
          setFilteredFlights([])
        }
      } catch (error) {
        console.error('Error calling search API:', error)
        setFlights([])
        setFilteredFlights([])
      } finally {
        setIsLoading(false)
      }
    }

    searchFlights()
  }, [searchParams])

  const handleSelectFlight = (flight: Flight) => {
    // Store selected flight and navigate to booking
    const bookingData = {
      flight,
      searchCriteria,
      selectedClass: searchCriteria?.flightClass || FlightClass.ECONOMY
    }
    
    sessionStorage.setItem('selectedFlight', JSON.stringify(bookingData))
    router.push('/flights/booking')
  }

  const handleFilterChange = (filters: any) => {
    let filtered = flights

    // Apply price filter
    if (filters.priceRange) {
      filtered = filtered.filter(flight => {
        const price = flight.pricing[FlightClass.ECONOMY].price
        return price >= filters.priceRange.min && price <= filters.priceRange.max
      })
    }

    // Apply airline filter
    if (filters.airlines && filters.airlines.length > 0) {
      filtered = filtered.filter(flight => filters.airlines.includes(flight.airline))
    }

    // Apply departure time filter
    if (filters.departureTime) {
      filtered = filtered.filter(flight => {
        const hour = new Date(flight.departureDate).getHours()
        switch (filters.departureTime) {
          case 'morning': return hour >= 6 && hour < 12
          case 'afternoon': return hour >= 12 && hour < 18
          case 'evening': return hour >= 18 && hour < 24
          case 'night': return hour >= 0 && hour < 6
          default: return true
        }
      })
    }

    setFilteredFlights(filtered)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
          <h2 className="text-xl font-bold text-gray-900">Đang tìm kiếm chuyến bay...</h2>
          <p className="text-gray-600">Vui lòng chờ trong giây lát</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Kết quả tìm kiếm chuyến bay
              </h1>
              {searchCriteria && (
                <p className="text-gray-600">
                  {searchCriteria.from} → {searchCriteria.to} • {new Date(searchCriteria.departureDate).toLocaleDateString('vi-VN')} • {searchCriteria.passengers.adults + searchCriteria.passengers.children} hành khách
                </p>
              )}
            </div>
            <button
              onClick={() => router.push('/flights')}
              className="px-4 py-2 text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
            >
              Tìm kiếm mới
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters */}
          <div className="lg:col-span-1">
            <FlightFilters 
              flights={flights}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {filteredFlights.length} chuyến bay được tìm thấy
              </h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Sắp xếp theo:</span>
                <select className="border border-gray-300 rounded px-3 py-1 text-sm">
                  <option value="price">Giá thấp nhất</option>
                  <option value="duration">Thời gian bay</option>
                  <option value="departure">Giờ khởi hành</option>
                </select>
              </div>
            </div>

            {filteredFlights.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 20.07a7.962 7.962 0 01-5-1.779M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Không tìm thấy chuyến bay phù hợp
                </h3>
                <p className="text-gray-600">
                  Vui lòng thử thay đổi bộ lọc hoặc tiêu chí tìm kiếm
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFlights.map((flight) => (
                  <FlightCard 
                    key={flight.id} 
                    flight={flight} 
                    onSelect={handleSelectFlight}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
