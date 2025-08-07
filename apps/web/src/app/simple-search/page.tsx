'use client'

import { useState } from 'react'

export default function SimpleFlightSearchPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/flights/search?from=SGN&to=HAN&departureDate=2025-08-15&adults=1&children=0&infants=0&class=economy')
      const data = await response.json()
      console.log('Search results:', data)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Simple Flight Search Test</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Đang tìm kiếm...' : 'Test Search API'}
          </button>
          
          <div className="mt-4 text-sm text-gray-600">
            Mở Developer Console để xem kết quả API
          </div>
        </div>
      </div>
    </div>
  )
}
