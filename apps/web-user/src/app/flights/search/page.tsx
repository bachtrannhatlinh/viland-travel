'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Flight, FlightSearchParams, FlightClass } from '@/types/flight.types'
import dynamic from 'next/dynamic'
import { Typography } from '@/components/ui/typography'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertCircle } from 'lucide-react'
import { apiClient } from '@/lib/utils'


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
      tripType,
      class: flightClass,
      adults: adults
    })

    // Call API to search flights
    const searchFlights = async () => {
      try {
        const searchParams = {
          from,
          to,
          departureDate,
          adults: adults.toString(),
          children: children.toString(),
          infants: infants.toString(),
          class: flightClass,
          ...(returnDate && { returnDate })
        }

        console.log('🔍 Searching flights with params:', searchParams)
        const data = await apiClient.get('/flights/search', searchParams)

        if (data.success) {
          console.log(`✅ Found ${data.data.totalCount} flights from ${data.data.dataSource}`)
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
          <Typography variant="h2" className="text-xl font-bold text-gray-900">Đang tìm kiếm chuyến bay...</Typography>
          <Typography variant="p" className="text-gray-600">Vui lòng chờ trong giây lát</Typography>
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
              <Typography variant="h1" className="text-2xl font-bold text-gray-900 mb-2">
                Kết quả tìm kiếm chuyến bay
              </Typography>
              {searchCriteria && (
                <Typography variant="p" className="text-gray-600">
                  {searchCriteria.from} → {searchCriteria.to} • {new Date(searchCriteria.departureDate).toLocaleDateString('vi-VN')} • {searchCriteria.passengers.adults + searchCriteria.passengers.children} hành khách
                </Typography>
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
              <Typography variant="h2" className="text-lg font-semibold text-gray-900">
                {filteredFlights.length} chuyến bay được tìm thấy
              </Typography>
              <div className="flex items-center space-x-2">
                <Typography variant="small" className="text-sm text-gray-600">Sắp xếp theo:</Typography>
                <Select defaultValue="price">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price">Giá thấp nhất</SelectItem>
                    <SelectItem value="duration">Thời gian bay</SelectItem>
                    <SelectItem value="departure">Giờ khởi hành</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {filteredFlights.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="text-gray-400 mb-4 flex justify-center">
                  <AlertCircle className="w-16 h-16" />
                </div>
                <Typography variant="h3" className="text-lg font-semibold text-gray-900 mb-2">
                  Không tìm thấy chuyến bay phù hợp
                </Typography>
                <Typography variant="p" className="text-gray-600">
                  Vui lòng thử thay đổi bộ lọc hoặc tiêu chí tìm kiếm
                </Typography>
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
