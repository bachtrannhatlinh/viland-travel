'use client'

import Link from 'next/link'
import { Menu } from 'lucide-react'
import { Typography } from '@/components/ui/typography'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { UserAvatar } from './UserAvatar'
import { useAuth } from '@/hooks/useAuth'

export function Header() {
  const { isAuthenticated } = useAuth()

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
              <Typography variant="large" className="text-2xl font-bold text-primary-600">
                ViLand Travel
              </Typography>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex relative z-[60]">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink className="text-gray-700 hover:text-primary-600 transition-colors px-4 py-2">
                    Trang chủ
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              {/* Services Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-gray-700 hover:text-primary-600 transition-colors">
                  Dịch vụ
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-4 w-[400px] grid-cols-2 bg-white">
                    {services.map((service) => (
                      <NavigationMenuLink key={service.name} asChild>
                        <Link href={service.href} className="block p-3 space-y-1 rounded-md hover:bg-gray-50 transition-colors border border-gray-100">
                          <Typography variant="small" className="text-sm font-medium leading-none text-gray-900">
                            {service.name}
                          </Typography>
                        </Link>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/about" legacyBehavior passHref>
                  <NavigationMenuLink className="text-gray-700 hover:text-primary-600 transition-colors px-4 py-2">
                    Giới thiệu
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/blog" legacyBehavior passHref>
                  <NavigationMenuLink className="text-gray-700 hover:text-primary-600 transition-colors px-4 py-2">
                    Tin tức
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/contact" legacyBehavior passHref>
                  <NavigationMenuLink className="text-gray-700 hover:text-primary-600 transition-colors px-4 py-2">
                    Liên hệ
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right side - User Avatar or Login/Mobile menu */}
          <div className="flex items-center space-x-4">
            {/* User Avatar for authenticated users */}
            {isAuthenticated && (
              <div className="hidden md:block">
                <UserAvatar />
              </div>
            )}

            {/* Login button for non-authenticated users */}
            {!isAuthenticated && (
              <div className="hidden md:block">
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Đăng nhập
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>ViLand Travel Menu</SheetTitle>
                    <SheetDescription>
                      Điều hướng đến các trang và dịch vụ của ViLand Travel
                    </SheetDescription>
                  </SheetHeader>
                  <div className="py-4 space-y-4">
                    {/* User info for mobile */}
                    {isAuthenticated && (
                      <div className="pb-4 border-b border-gray-200">
                        <UserAvatar />
                      </div>
                    )}

                    {/* Login button for mobile */}
                    {!isAuthenticated && (
                      <div className="pb-4 border-b border-gray-200">
                        <Link href="/login">
                          <Button variant="outline" className="w-full">
                            Đăng nhập
                          </Button>
                        </Link>
                      </div>
                    )}

                    <Link href="/" className="block text-gray-700 hover:text-primary-600">
                      Trang chủ
                    </Link>

                    <div>
                      <span className="block font-medium text-gray-900">Dịch vụ</span>
                      <div className="ml-4 mt-2 space-y-2">
                        {services.map((service) => (
                          <Link
                            key={service.name}
                            href={service.href}
                            prefetch={false}
                            className="block text-gray-700 hover:text-primary-600"
                          >
                            {service.name}
                          </Link>
                        ))}
                      </div>
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
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
