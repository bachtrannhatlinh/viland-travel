import { Flight } from '@/types/flight.types'
import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Typography } from '@/components/ui/typography'
import { Card, CardContent } from '@/components/ui/card'

interface FlightFiltersProps {
  flights: Flight[]
  onFilterChange: (filters: any) => void
}

export default function FlightFilters({ flights, onFilterChange }: FlightFiltersProps) {
  const [selectedFilters, setSelectedFilters] = useState({
    airlines: [] as string[],
    priceRange: { min: 0, max: 10000000 },
    departureTime: '',
    stops: 'all'
  })

  // Calculate available filters from flights data
  const availableFilters = useMemo(() => {
    if (!flights || flights.length === 0) {
      return {
        airlines: [],
        priceRange: { min: 0, max: 10000000 },
        departureTimeRanges: ['morning', 'afternoon', 'evening', 'night']
      }
    }

    const airlines = Array.from(new Set(flights.map(f => f.airline)))
    const prices = flights.map(f => f.pricing?.economy?.price || 0).filter(p => p > 0)
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 10000000

    return {
      airlines,
      priceRange: { min: minPrice, max: maxPrice },
      departureTimeRanges: ['morning', 'afternoon', 'evening', 'night']
    }
  }, [flights])

  const handleAirlineChange = (airline: string, checked: boolean) => {
    const newAirlines = checked
      ? [...selectedFilters.airlines, airline]
      : selectedFilters.airlines.filter((a: string) => a !== airline)
    
    const newFilters = {
      ...selectedFilters,
      airlines: newAirlines
    }
    setSelectedFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handlePriceRangeChange = (min: number, max: number) => {
    const newFilters = {
      ...selectedFilters,
      priceRange: { min, max }
    }
    setSelectedFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleDepartureTimeChange = (timeRange: string) => {
    const newFilters = {
      ...selectedFilters,
      departureTime: selectedFilters.departureTime === timeRange ? '' : timeRange
    }
    setSelectedFilters(newFilters)
    onFilterChange(newFilters)
  }

  const formatPrice = (price: number) => {
    return `${(price / 1000000).toFixed(1)}M`
  }

  const getTimeLabel = (timeRange: string) => {
    switch (timeRange) {
      case 'morning': return 'Sáng (06:00 - 12:00)'
      case 'afternoon': return 'Chiều (12:00 - 18:00)'
      case 'evening': return 'Tối (18:00 - 24:00)'
      case 'night': return 'Đêm (00:00 - 06:00)'
      default: return timeRange
    }
  }

  const resetFilters = () => {
    const defaultFilters = {
      airlines: [],
      priceRange: availableFilters.priceRange,
      departureTime: '',
      stops: 'all'
    }
    setSelectedFilters(defaultFilters)
    onFilterChange(defaultFilters)
  }

  return (
    <Card className="sticky top-4">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Typography variant="h3" className="font-bold text-lg">Bộ lọc</Typography>
          <Button
            onClick={resetFilters}
            variant="link"
            className="text-sm text-primary-600 hover:text-primary-700 p-0"
          >
            Đặt lại
          </Button>
        </div>

        {/* Price Filter */}
        <div className="mb-6">
          <Typography variant="h4" className="font-semibold text-gray-900 mb-3">Khoảng giá</Typography>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <Typography variant="small">{formatPrice(availableFilters.priceRange.min)}</Typography>
              <Typography variant="small">{formatPrice(availableFilters.priceRange.max)}</Typography>
            </div>
            <input
              type="range"
              min={availableFilters.priceRange.min}
              max={availableFilters.priceRange.max}
              value={selectedFilters.priceRange.max}
              onChange={(e) => handlePriceRangeChange(availableFilters.priceRange.min, parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <Typography variant="small" className="text-sm text-gray-600">
              Tối đa: {formatPrice(selectedFilters.priceRange.max)} VND
            </Typography>
          </div>
        </div>

        {/* Airlines Filter */}
        {availableFilters.airlines.length > 0 && (
          <div className="mb-6">
            <Typography variant="h4" className="font-semibold text-gray-900 mb-3">Hãng hàng không</Typography>
            <div className="space-y-2">
              {availableFilters.airlines.map((airline: string) => (
                <label key={airline} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedFilters.airlines.includes(airline)}
                    onChange={(e) => handleAirlineChange(airline, e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <Typography variant="small" className="ml-2 text-sm text-gray-700">{airline}</Typography>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Departure Time Filter */}
        <div className="mb-6">
          <Typography variant="h4" className="font-semibold text-gray-900 mb-3">Giờ khởi hành</Typography>
          <div className="space-y-2">
            {availableFilters.departureTimeRanges.map((timeRange: string) => (
              <label key={timeRange} className="flex items-center">
                <input
                  type="radio"
                  name="departureTime"
                  checked={selectedFilters.departureTime === timeRange}
                  onChange={() => handleDepartureTimeChange(timeRange)}
                  className="border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <Typography variant="small" className="ml-2 text-sm text-gray-700">
                  {getTimeLabel(timeRange)}
                </Typography>
              </label>
            ))}
          </div>
        </div>

        {/* Stops Filter */}
        <div className="mb-6">
          <Typography variant="h4" className="font-semibold text-gray-900 mb-3">Điểm dừng</Typography>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="stops"
                value="direct"
                checked={selectedFilters.stops === 'direct'}
                onChange={(e) => {
                  const newFilters = { ...selectedFilters, stops: e.target.value }
                  setSelectedFilters(newFilters)
                  onFilterChange(newFilters)
                }}
                className="border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <Typography variant="small" className="ml-2 text-sm text-gray-700">Bay thẳng</Typography>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="stops"
                value="all"
                checked={selectedFilters.stops === 'all'}
                onChange={(e) => {
                  const newFilters = { ...selectedFilters, stops: e.target.value }
                  setSelectedFilters(newFilters)
                  onFilterChange(newFilters)
                }}
                className="border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <Typography variant="small" className="ml-2 text-sm text-gray-700">Tất cả</Typography>
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
