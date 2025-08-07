'use client'

import { Search, Calendar, MapPin } from 'lucide-react'
import { useState } from 'react'

export function HeroSection() {
  const [activeTab, setActiveTab] = useState('tour')

  const tabs = [
    { id: 'tour', label: 'Tour du lịch', icon: MapPin },
    { id: 'flight', label: 'Vé máy bay', icon: MapPin },
    { id: 'hotel', label: 'Khách sạn', icon: MapPin },
    { id: 'car', label: 'Thuê xe', icon: MapPin },
  ]

  return (
    <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Khám phá thế giới cùng
            <span className="block text-secondary-400">GoSafe</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Đặt tour, vé máy bay, khách sạn và thuê xe một cách dễ dàng
          </p>
        </div>

        {/* Search Form */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-6">
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </button>
                )
              })}
            </div>

            {/* Search Form Based on Active Tab */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {activeTab === 'tour' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Điểm đến
                    </label>
                    <input
                      type="text"
                      placeholder="Chọn điểm đến"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ngày khởi hành
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số người
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900">
                      <option>1 người</option>
                      <option>2 người</option>
                      <option>3-5 người</option>
                      <option>6+ người</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button className="w-full btn-primary h-10 flex items-center justify-center">
                      <Search className="h-4 w-4 mr-2" />
                      Tìm tour
                    </button>
                  </div>
                </>
              )}

              {activeTab === 'flight' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Từ
                    </label>
                    <input
                      type="text"
                      placeholder="Thành phố đi"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Đến
                    </label>
                    <input
                      type="text"
                      placeholder="Thành phố đến"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ngày bay
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                    />
                  </div>
                  <div className="flex items-end">
                    <button className="w-full btn-primary h-10 flex items-center justify-center">
                      <Search className="h-4 w-4 mr-2" />
                      Tìm chuyến bay
                    </button>
                  </div>
                </>
              )}

              {/* Add similar forms for hotel and car tabs */}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
