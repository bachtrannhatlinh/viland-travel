'use client'

import { useEffect } from 'react'

export function ChunkErrorHandler() {
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
        console.warn('ChunkLoadError detected, reloading page...')
        // Reload the page to fix chunk loading issues
        window.location.reload()
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
        console.warn('ChunkLoadError in promise rejection, reloading page...')
        event.preventDefault()
        window.location.reload()
      }
    }

    // Listen for both error events and unhandled promise rejections
    window.addEventListener('error', handleChunkError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('error', handleChunkError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  return null
}

