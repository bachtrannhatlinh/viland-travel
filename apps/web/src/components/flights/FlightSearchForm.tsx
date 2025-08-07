'use client'

import { useState } from 'react'
import { FlightSearchParams, FlightClass } from '@/types/flight.types'

interface FlightSearchFormProps {
  onSearch: (params: FlightSearchParams) => void
  isLoading?: boolean
}

export default function FlightSearchForm({ onSearch, isLoading = false }: FlightSearchFormProps) {
  const [tripType, setTripType] = useState<'one-way' | 'round-trip'>('one-way')
  const [searchParams, setSearchParams] = useState<FlightSearchParams>({
    from: '',
    to: '',
    departureDate: '',
    returnDate: '',
    passengers: {
      adults: 1,
      children: 0,
      infants: 0
    },
    flightClass: FlightClass.ECONOMY,
    tripType: 'one-way'
  })

  const handleInputChange = (field: string, value: any) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePassengerChange = (type: 'adults' | 'children' | 'infants', value: number) => {
    setSearchParams(prev => ({
      ...prev,
      passengers: {
        ...prev.passengers,
        [type]: Math.max(0, value)
      }
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchParams.from || !searchParams.to || !searchParams.departureDate) {
      alert('Vui lòng điền đầy đủ thông tin tìm kiếm')
      return
    }
    
    onSearch({
      ...searchParams,
      tripType
    })
  }

  const getTotalPassengers = () => {
    return searchParams.passengers.adults + searchParams.passengers.children + searchParams.passengers.infants
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Trip Type Selection */}
      <div className="flex space-x-4 mb-6">
        <label className="flex items-center">
          <input
            type="radio"
            value="one-way"
            checked={tripType === 'one-way'}
            onChange={(e) => setTripType(e.target.value as 'one-way')}
            className="mr-2"
          />
          <span>Một chiều</span>
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            value="round-trip"
            checked={tripType === 'round-trip'}
            onChange={(e) => setTripType(e.target.value as 'round-trip')}
            className="mr-2"
          />
          <span>Khứ hồi</span>
        </label>
      </div>

      {/* Main Search Form */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* From */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Từ
          </label>
          <input
            type="text"
            placeholder="Thành phố đi"
            value={searchParams.from}
            onChange={(e) => handleInputChange('from', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
        </div>

        {/* To */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Đến
          </label>
          <input
            type="text"
            placeholder="Thành phố đến"
            value={searchParams.to}
            onChange={(e) => handleInputChange('to', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
        </div>

        {/* Departure Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ngày bay
          </label>
          <input
            type="date"
            value={searchParams.departureDate}
            onChange={(e) => handleInputChange('departureDate', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
        </div>

        {/* Return Date (if round trip) */}
        {tripType === 'round-trip' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ngày về
            </label>
            <input
              type="date"
              value={searchParams.returnDate || ''}
              onChange={(e) => handleInputChange('returnDate', e.target.value)}
              min={searchParams.departureDate || new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        )}
      </div>

      {/* Passengers and Class */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Passengers */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hành khách
          </label>
          <div className="relative">
            <button
              type="button"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-left focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {getTotalPassengers()} hành khách
            </button>
            {/* Passenger dropdown would go here - simplified for now */}
          </div>
        </div>

        {/* Flight Class */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hạng vé
          </label>
          <select
            value={searchParams.flightClass}
            onChange={(e) => handleInputChange('flightClass', e.target.value as FlightClass)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value={FlightClass.ECONOMY}>Phổ thông</option>
            <option value={FlightClass.PREMIUM_ECONOMY}>Phổ thông đặc biệt</option>
            <option value={FlightClass.BUSINESS}>Thương gia</option>
            <option value={FlightClass.FIRST}>Hạng nhất</option>
          </select>
        </div>

        {/* Search Button */}
        <div className="flex items-end">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Đang tìm kiếm...' : 'Tìm chuyến bay'}
          </button>
        </div>
      </div>

      {/* Quick passenger adjustment */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium mb-3">Chi tiết hành khách</h4>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Người lớn (12+)</label>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => handlePassengerChange('adults', searchParams.passengers.adults - 1)}
                className="w-8 h-8 border border-gray-300 rounded text-sm hover:bg-gray-50"
                disabled={searchParams.passengers.adults <= 1}
              >
                -
              </button>
              <span className="w-8 text-center">{searchParams.passengers.adults}</span>
              <button
                type="button"
                onClick={() => handlePassengerChange('adults', searchParams.passengers.adults + 1)}
                className="w-8 h-8 border border-gray-300 rounded text-sm hover:bg-gray-50"
              >
                +
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-1">Trẻ em (2-11)</label>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => handlePassengerChange('children', searchParams.passengers.children - 1)}
                className="w-8 h-8 border border-gray-300 rounded text-sm hover:bg-gray-50"
                disabled={searchParams.passengers.children <= 0}
              >
                -
              </button>
              <span className="w-8 text-center">{searchParams.passengers.children}</span>
              <button
                type="button"
                onClick={() => handlePassengerChange('children', searchParams.passengers.children + 1)}
                className="w-8 h-8 border border-gray-300 rounded text-sm hover:bg-gray-50"
              >
                +
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-1">Em bé (&lt;2)</label>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => handlePassengerChange('infants', searchParams.passengers.infants - 1)}
                className="w-8 h-8 border border-gray-300 rounded text-sm hover:bg-gray-50"
                disabled={searchParams.passengers.infants <= 0}
              >
                -
              </button>
              <span className="w-8 text-center">{searchParams.passengers.infants}</span>
              <button
                type="button"
                onClick={() => handlePassengerChange('infants', searchParams.passengers.infants + 1)}
                className="w-8 h-8 border border-gray-300 rounded text-sm hover:bg-gray-50"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
