import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import 'react-toastify/dist/ReactToastify.css'
import { Providers } from './providers'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PreloadLinks } from '@/components/layout/PreloadLinks'
import { Section } from '@/components/ui/section'
import ErrorBoundary from '@/components/ErrorBoundary'
import { ChunkErrorHandler } from '@/components/ChunkErrorHandler'
import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration'
import { ToastContainer } from 'react-toastify'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ViLand Travel - Booking Tour Du Lịch',
  description: 'Đặt vé máy bay, tour du lịch, khách sạn và thuê xe với ViLand Travel - Nền tảng booking tour hàng đầu Việt Nam',
  keywords: 'booking tour, vé máy bay, khách sạn, thuê xe, du lịch việt nam',
  manifest: '/manifest.json',
  themeColor: '#3b82f6',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ViLand Travel',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'ViLand Travel',
    'application-name': 'ViLand Travel',
    'msapplication-TileColor': '#3b82f6',
    'msapplication-config': '/browserconfig.xml',
  },
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
              <ServiceWorkerRegistration />
            </div>
          </ErrorBoundary>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </Providers>
      </body>
    </html>
  )
}
