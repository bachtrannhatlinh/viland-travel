import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PreloadLinks } from '@/components/layout/PreloadLinks'
import { Section } from '@/components/ui/section'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GoSafe - Booking Tour Du Lịch',
  description: 'Đặt vé máy bay, tour du lịch, khách sạn và thuê xe với GoSafe - Nền tảng booking tour hàng đầu Việt Nam',
  keywords: 'booking tour, vé máy bay, khách sạn, thuê xe, du lịch việt nam',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <Section as="main" className="flex-1">
              {children}
            </Section>
            <Footer />
            <PreloadLinks />
          </div>
        </Providers>
      </body>
    </html>
  )
}
