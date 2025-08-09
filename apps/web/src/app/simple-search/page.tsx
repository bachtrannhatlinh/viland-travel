'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Typography } from '@/components/ui/typography'
import { Card, CardContent } from '@/components/ui/card'
import { Section } from '@/components/ui/section'

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
    <Section className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Typography variant="h1" className="text-3xl font-bold mb-8">Simple Flight Search Test</Typography>

        <Card>
          <CardContent className="p-6">
            <Button
              onClick={handleSearch}
              disabled={isLoading}
            >
              {isLoading ? 'Đang tìm kiếm...' : 'Test Search API'}
            </Button>

            <Typography variant="small" className="mt-4 text-sm text-gray-600">
              Mở Developer Console để xem kết quả API
            </Typography>
          </CardContent>
        </Card>
      </div>
    </Section>
  )
}
