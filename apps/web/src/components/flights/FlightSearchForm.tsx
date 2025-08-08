'use client'

import { useState } from 'react'
import { FlightSearchParams, FlightClass } from '@/types/flight.types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const flightSearchSchema = z.object({
  from: z.string().min(1, 'Vui lòng chọn điểm đi'),
  to: z.string().min(1, 'Vui lòng chọn điểm đến'),
  departureDate: z.string().min(1, 'Vui lòng chọn ngày bay'),
  returnDate: z.string().optional(),
  tripType: z.enum(['one-way', 'round-trip']),
  flightClass: z.nativeEnum(FlightClass),
  passengers: z.object({
    adults: z.number().min(1, 'Phải có ít nhất 1 người lớn'),
    children: z.number().min(0),
    infants: z.number().min(0),
  }),
})

type FlightSearchFormValues = z.infer<typeof flightSearchSchema>

interface FlightSearchFormProps {
  onSearch: (params: FlightSearchParams) => void
  isLoading?: boolean
}

export default function FlightSearchForm({ onSearch, isLoading = false }: FlightSearchFormProps) {
  const form = useForm<FlightSearchFormValues>({
    resolver: zodResolver(flightSearchSchema),
    defaultValues: {
      from: '',
      to: '',
      departureDate: '',
      returnDate: '',
      tripType: 'one-way',
      flightClass: FlightClass.ECONOMY,
      passengers: {
        adults: 1,
        children: 0,
        infants: 0
      }
    }
  })

  const tripType = form.watch('tripType')

  const handlePassengerChange = (type: 'adults' | 'children' | 'infants', value: number) => {
    const currentPassengers = form.getValues('passengers')
    form.setValue('passengers', {
      ...currentPassengers,
      [type]: Math.max(0, value)
    })
  }

  const onSubmit = (values: FlightSearchFormValues) => {
    onSearch({
      ...values,
      passengers: values.passengers
    })
  }

  const getTotalPassengers = () => {
    const passengers = form.getValues('passengers')
    return passengers.adults + passengers.children + passengers.infants
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Trip Type Selection */}
        <FormField
          control={form.control}
          name="tripType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loại chuyến bay</FormLabel>
              <FormControl>
                <div className="flex space-x-4">
                  <Label className="flex items-center space-x-2 cursor-pointer">
                    <Input
                      type="radio"
                      value="one-way"
                      checked={field.value === 'one-way'}
                      onChange={() => field.onChange('one-way')}
                      className="w-4 h-4"
                    />
                    <span>Một chiều</span>
                  </Label>
                  <Label className="flex items-center space-x-2 cursor-pointer">
                    <Input
                      type="radio"
                      value="round-trip"
                      checked={field.value === 'round-trip'}
                      onChange={() => field.onChange('round-trip')}
                      className="w-4 h-4"
                    />
                    <span>Khứ hồi</span>
                  </Label>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Main Search Form */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* From */}
          <FormField
            control={form.control}
            name="from"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Từ</FormLabel>
                <FormControl>
                  <Input placeholder="Thành phố đi" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* To */}
          <FormField
            control={form.control}
            name="to"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Đến</FormLabel>
                <FormControl>
                  <Input placeholder="Thành phố đến" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Departure Date */}
          <FormField
            control={form.control}
            name="departureDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày bay</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Return Date (if round trip) */}
          {tripType === 'round-trip' && (
            <FormField
              control={form.control}
              name="returnDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ngày về</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      min={form.getValues('departureDate') || new Date().toISOString().split('T')[0]}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        {/* Passengers and Class */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Passengers Display */}
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Hành khách
            </Label>
            <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white">
              {getTotalPassengers()} hành khách
            </div>
          </div>

          {/* Flight Class */}
          <FormField
            control={form.control}
            name="flightClass"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hạng vé</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn hạng vé" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={FlightClass.ECONOMY}>Phổ thông</SelectItem>
                    <SelectItem value={FlightClass.PREMIUM_ECONOMY}>Phổ thông đặc biệt</SelectItem>
                    <SelectItem value={FlightClass.BUSINESS}>Thương gia</SelectItem>
                    <SelectItem value={FlightClass.FIRST}>Hạng nhất</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Search Button */}
          <div className="flex items-end">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-3"
            >
              {isLoading ? 'Đang tìm kiếm...' : 'Tìm chuyến bay'}
            </Button>
          </div>
        </div>

        {/* Quick passenger adjustment */}
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium mb-3">Chi tiết hành khách</h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="block text-sm text-gray-600 mb-1">Người lớn (12+)</Label>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const currentAdults = form.getValues('passengers.adults')
                      handlePassengerChange('adults', currentAdults - 1)
                    }}
                    disabled={form.getValues('passengers.adults') <= 1}
                    className="h-8 w-8 p-0"
                  >
                    -
                  </Button>
                  <span className="w-8 text-center">{form.watch('passengers.adults')}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const currentAdults = form.getValues('passengers.adults')
                      handlePassengerChange('adults', currentAdults + 1)
                    }}
                    className="h-8 w-8 p-0"
                  >
                    +
                  </Button>
                </div>
              </div>
              
              <div>
                <Label className="block text-sm text-gray-600 mb-1">Trẻ em (2-11)</Label>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const currentChildren = form.getValues('passengers.children')
                      handlePassengerChange('children', currentChildren - 1)
                    }}
                    disabled={form.getValues('passengers.children') <= 0}
                    className="h-8 w-8 p-0"
                  >
                    -
                  </Button>
                  <span className="w-8 text-center">{form.watch('passengers.children')}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const currentChildren = form.getValues('passengers.children')
                      handlePassengerChange('children', currentChildren + 1)
                    }}
                    className="h-8 w-8 p-0"
                  >
                    +
                  </Button>
                </div>
              </div>
              
              <div>
                <Label className="block text-sm text-gray-600 mb-1">Em bé (&lt;2)</Label>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const currentInfants = form.getValues('passengers.infants')
                      handlePassengerChange('infants', currentInfants - 1)
                    }}
                    disabled={form.getValues('passengers.infants') <= 0}
                    className="h-8 w-8 p-0"
                  >
                    -
                  </Button>
                  <span className="w-8 text-center">{form.watch('passengers.infants')}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const currentInfants = form.getValues('passengers.infants')
                      handlePassengerChange('infants', currentInfants + 1)
                    }}
                    className="h-8 w-8 p-0"
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}
