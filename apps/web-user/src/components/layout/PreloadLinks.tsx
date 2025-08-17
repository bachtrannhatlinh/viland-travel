'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Component để preload các trang quan trọng
export function PreloadLinks() {
  const router = useRouter()

  useEffect(() => {
    // Chỉ preload khi user đã tương tác với trang
    let hasInteracted = false

    const handleInteraction = () => {
      if (!hasInteracted) {
        hasInteracted = true
        // Preload các trang dịch vụ chính sau khi user tương tác
        setTimeout(() => {
          router.prefetch('/flights')
          router.prefetch('/tours')
          router.prefetch('/hotels')
        }, 1000)

        // Remove event listeners sau khi đã preload
        document.removeEventListener('mouseenter', handleInteraction)
        document.removeEventListener('click', handleInteraction)
        document.removeEventListener('scroll', handleInteraction)
      }
    }

    // Lắng nghe các sự kiện tương tác
    document.addEventListener('mouseenter', handleInteraction, { once: true })
    document.addEventListener('click', handleInteraction, { once: true })
    document.addEventListener('scroll', handleInteraction, { once: true })

    return () => {
      document.removeEventListener('mouseenter', handleInteraction)
      document.removeEventListener('click', handleInteraction)
      document.removeEventListener('scroll', handleInteraction)
    }
  }, [router])

  return null
}
