'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, ChevronDown } from 'lucide-react'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const services = [
    { name: 'Vé máy bay', href: '/flights' },
    { name: 'Tour du lịch', href: '/tours' },
    { name: 'Khách sạn', href: '/hotels' },
    { name: 'Thuê xe', href: '/car-rental' },
    { name: 'Go_Safe Driver', href: '/driver-service' },
  ]

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary-600">GoSafe</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary-600 transition-colors">
              Trang chủ
            </Link>
            
            {/* Services Dropdown */}
            <div className="relative group">
              <button className="flex items-center text-gray-700 hover:text-primary-600 transition-colors">
                Dịch vụ
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-2">
                  {services.map((service) => (
                    <Link
                      key={service.name}
                      href={service.href}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                    >
                      {service.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link href="/about" className="text-gray-700 hover:text-primary-600 transition-colors">
              Giới thiệu
            </Link>
            <Link href="/blog" className="text-gray-700 hover:text-primary-600 transition-colors">
              Tin tức
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-primary-600 transition-colors">
              Liên hệ
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary-600"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="space-y-4">
              <Link href="/" className="block text-gray-700 hover:text-primary-600">
                Trang chủ
              </Link>
              <div className="space-y-2">
                <span className="block font-medium text-gray-900">Dịch vụ</span>
                {services.map((service) => (
                  <Link
                    key={service.name}
                    href={service.href}
                    className="block pl-4 text-gray-700 hover:text-primary-600"
                  >
                    {service.name}
                  </Link>
                ))}
              </div>
              <Link href="/about" className="block text-gray-700 hover:text-primary-600">
                Giới thiệu
              </Link>
              <Link href="/blog" className="block text-gray-700 hover:text-primary-600">
                Tin tức
              </Link>
              <Link href="/contact" className="block text-gray-700 hover:text-primary-600">
                Liên hệ
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
