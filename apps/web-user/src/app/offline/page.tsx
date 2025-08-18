'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Typography } from '@/components/ui/typography'
import { Section } from '@/components/ui/section'
import { WifiOff, RefreshCw } from 'lucide-react'
import { clearServiceWorkerCache } from '@/components/ServiceWorkerRegistration'

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(true)
  const [isClearing, setIsClearing] = useState(false)

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine)
    }

    // Check initial status
    updateOnlineStatus()

    // Listen for online/offline events
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }, [])

  const handleRetry = () => {
    if (isOnline) {
      window.location.href = '/'
    } else {
      window.location.reload()
    }
  }

  const handleClearCache = async () => {
    setIsClearing(true)
    try {
      const success = await clearServiceWorkerCache()
      if (success) {
        alert('Cache đã được xóa thành công. Trang sẽ được tải lại.')
        window.location.reload()
      } else {
        alert('Không thể xóa cache. Vui lòng thử lại.')
      }
    } catch (error) {
      console.error('Error clearing cache:', error)
      alert('Có lỗi xảy ra khi xóa cache.')
    } finally {
      setIsClearing(false)
    }
  }

  return (
    <Section className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Section className="max-w-md mx-auto text-center px-4">
        <div className="mb-8">
          <WifiOff className="w-24 h-24 mx-auto text-gray-400 mb-4" />
          <Typography variant="h1" className="text-2xl font-bold text-gray-900 mb-2">
            {isOnline ? 'Lỗi tải trang' : 'Không có kết nối mạng'}
          </Typography>
          <Typography variant="large" className="text-gray-600 mb-6">
            {isOnline 
              ? 'Có lỗi xảy ra khi tải trang. Vui lòng thử lại.'
              : 'Vui lòng kiểm tra kết nối internet và thử lại.'
            }
          </Typography>
        </div>

        <div className="space-y-4">
          <Button 
            onClick={handleRetry}
            className="w-full"
            size="lg"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {isOnline ? 'Thử lại' : 'Kiểm tra kết nối'}
          </Button>

          <Button 
            onClick={handleClearCache}
            variant="outline"
            className="w-full"
            size="lg"
            disabled={isClearing}
          >
            {isClearing ? 'Đang xóa...' : 'Xóa cache và thử lại'}
          </Button>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>Nếu vấn đề vẫn tiếp tục, hãy thử:</p>
          <ul className="mt-2 space-y-1 text-left">
            <li>• Tắt và mở lại trình duyệt</li>
            <li>• Xóa cache trình duyệt (Ctrl+Shift+Delete)</li>
            <li>• Kiểm tra kết nối internet</li>
            <li>• Liên hệ hỗ trợ kỹ thuật</li>
          </ul>
        </div>

        <div className="mt-6">
          <Typography variant="small" className="text-gray-400">
            Trạng thái kết nối: {isOnline ? '🟢 Trực tuyến' : '🔴 Ngoại tuyến'}
          </Typography>
        </div>
      </Section>
    </Section>
  )
}
