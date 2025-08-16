import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PreloadLinks } from '@/components/layout/PreloadLinks'
import { Section } from '@/components/ui/section'
import ErrorBoundary from '@/components/ErrorBoundary'
import { ChunkErrorHandler } from '@/components/ChunkErrorHandler'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ViLand Travel - Booking Tour Du Lịch',
  description: 'Đặt vé máy bay, tour du lịch, khách sạn và thuê xe với ViLand Travel - Nền tảng booking tour hàng đầu Việt Nam',
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
          <ErrorBoundary>
            <div className="min-h-screen flex flex-col">
              <Header />
              <Section as="main" className="flex-1">
                {children}
              </Section>
              <Footer />
              <PreloadLinks />
              <ChunkErrorHandler />
            </div>
          </ErrorBoundary>
        </Providers>
      </body>
    </html>
  )
}
