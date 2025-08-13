'use client'

import { Search, Calendar, MapPin } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Section } from '@/components/ui/section'
import { Typography } from '@/components/ui/typography'
import { DatePicker } from '@/components/ui/date-picker'

export function HeroSection() {
  const [activeTab, setActiveTab] = useState('tour')

  const tabs = [
    { id: 'tour', label: 'Tour du lịch', icon: MapPin },
    { id: 'flight', label: 'Vé máy bay', icon: MapPin },
    { id: 'hotel', label: 'Khách sạn', icon: MapPin },
    { id: 'car', label: 'Thuê xe', icon: MapPin },
  ]

  return (
    <Section variant="hero" background="gradient" className="text-white">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <Typography variant="h1" className="text-4xl md:text-6xl font-bold mb-6">
            Khám phá thế giới cùng
            <Typography variant="small" className="block text-secondary-400">GoSafe</Typography>
          </Typography>
          <Typography variant="large" className="text-xl md:text-2xl mb-8 text-gray-200">
            Đặt tour, vé máy bay, khách sạn và thuê xe một cách dễ dàng
          </Typography>
        </div>

        {/* Search Form */}
        <div className="max-w-4xl mx-auto">
          <Card className="p-6">
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <Button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    variant={activeTab === tab.id ? "default" : "outline"}
                    className="flex items-center"
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </Button>
                )
              })}
            </div>

            {/* Search Form Based on Active Tab */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {activeTab === 'tour' && (
                <>
                  <div>
                    <Label className="block mb-2">
                      Điểm đến
                    </Label>
                    <Input
                      type="text"
                      placeholder="Chọn điểm đến"
                    />
                  </div>
                  <div>
                    <Label className="block mb-2">
                      Ngày khởi hành
                    </Label>
                    <DatePicker placeholder="Chọn ngày khởi hành" />
                  </div>
                  <div>
                    <Label className="block mb-2">
                      Số người
                    </Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn số người" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 người</SelectItem>
                        <SelectItem value="2">2 người</SelectItem>
                        <SelectItem value="3-5">3-5 người</SelectItem>
                        <SelectItem value="6+">6+ người</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button className="w-full h-10">
                      <Search className="h-4 w-4 mr-2" />
                      Tìm tour
                    </Button>
                  </div>
                </>
              )}

              {activeTab === 'flight' && (
                <>
                  <div>
                    <Label className="block mb-2">
                      Từ
                    </Label>
                    <Input
                      type="text"
                      placeholder="Thành phố đi"
                    />
                  </div>
                  <div>
                    <Label className="block mb-2">
                      Đến
                    </Label>
                    <Input
                      type="text"
                      placeholder="Thành phố đến"
                    />
                  </div>
                  <div>
                    <Label className="block mb-2">
                      Ngày bay
                    </Label>
                    <DatePicker placeholder="Chọn ngày bay" />
                  </div>
                  <div className="flex items-end">
                    <Button className="w-full h-10">
                      <Search className="h-4 w-4 mr-2" />
                      Tìm chuyến bay
                    </Button>
                  </div>
                </>
              )}

              {/* Add similar forms for hotel and car tabs */}
            </div>
          </Card>
        </div>
      </div>
    </Section>
  )
}
