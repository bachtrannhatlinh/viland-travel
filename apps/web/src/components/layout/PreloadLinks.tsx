'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Component để preload các trang quan trọng
export function PreloadLinks() {
  const router = useRouter()

  useEffect(() => {
    // Preload các trang dịch vụ chính sau 2 giây
    const timer = setTimeout(() => {
      router.prefetch('/flights')
      router.prefetch('/tours')
      router.prefetch('/hotels')
      router.prefetch('/car-rental')
      router.prefetch('/driver-service')
    }, 2000)

    return () => clearTimeout(timer)
  }, [router])

  return null
}
