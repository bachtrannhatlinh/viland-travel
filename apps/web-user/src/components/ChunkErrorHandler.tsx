'use client'

import { useEffect, useRef } from 'react'

export function ChunkErrorHandler() {
  const reloadAttempts = useRef(0)
  const maxReloadAttempts = 3
  const reloadCooldown = useRef(0)

  useEffect(() => {
    const handleChunkError = (event: ErrorEvent) => {
      const error = event.error

      // Check if it's a ChunkLoadError
      if (
        error?.name === 'ChunkLoadError' ||
        error?.message?.includes('Loading chunk') ||
        error?.message?.includes('Loading CSS chunk') ||
        event.message?.includes('Loading chunk')
      ) {
        console.warn('ChunkLoadError detected:', error?.message || event.message)

        // Prevent infinite reload loops
        const now = Date.now()
        if (now - reloadCooldown.current < 5000) { // 5 second cooldown
          console.warn('ChunkLoadError: Too many reload attempts, skipping...')
          return
        }

        if (reloadAttempts.current >= maxReloadAttempts) {
          console.error('ChunkLoadError: Max reload attempts reached. Please clear cache and refresh manually.')
          // Show user-friendly error message instead of infinite reloads
          if (typeof window !== 'undefined') {
            const userConfirm = confirm(
              'Ứng dụng gặp lỗi tải tài nguyên. Bạn có muốn làm mới trang không?\n\n' +
              'Nếu lỗi vẫn tiếp tục, hãy thử:\n' +
              '1. Xóa cache trình duyệt (Ctrl+Shift+Delete)\n' +
              '2. Tắt và mở lại trình duyệt'
            )
            if (userConfirm) {
              reloadAttempts.current = 0
              window.location.reload()
            }
          }
          return
        }

        reloadAttempts.current++
        reloadCooldown.current = now
        console.warn(`ChunkLoadError: Reloading page (attempt ${reloadAttempts.current}/${maxReloadAttempts})...`)

        // Add a small delay before reload to prevent race conditions
        setTimeout(() => {
          window.location.reload()
        }, 100)
      }
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason

      // Check if it's a ChunkLoadError in promise rejection
      if (
        error?.name === 'ChunkLoadError' ||
        error?.message?.includes('Loading chunk') ||
        error?.message?.includes('Loading CSS chunk')
      ) {
        console.warn('ChunkLoadError in promise rejection:', error?.message)
        event.preventDefault()

        // Use the same logic as handleChunkError
        const now = Date.now()
        if (now - reloadCooldown.current < 5000) {
          console.warn('ChunkLoadError: Too many reload attempts, skipping...')
          return
        }

        if (reloadAttempts.current >= maxReloadAttempts) {
          console.error('ChunkLoadError: Max reload attempts reached.')
          return
        }

        reloadAttempts.current++
        reloadCooldown.current = now
        console.warn(`ChunkLoadError: Reloading page (attempt ${reloadAttempts.current}/${maxReloadAttempts})...`)

        setTimeout(() => {
          window.location.reload()
        }, 100)
      }
    }

    // Reset reload attempts on successful page load
    const handlePageShow = () => {
      reloadAttempts.current = 0
    }

    // Listen for events
    window.addEventListener('error', handleChunkError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    window.addEventListener('pageshow', handlePageShow)

    return () => {
      window.removeEventListener('error', handleChunkError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
      window.removeEventListener('pageshow', handlePageShow)
    }
  }, [])

  return null
}

