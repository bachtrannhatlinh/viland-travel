'use client'

import React from 'react'
import { Typography } from '@/components/ui/typography'
import { Section } from '@/components/ui/section'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    // Check if it's a ChunkLoadError
    if (error.name === 'ChunkLoadError' || error.message.includes('Loading chunk')) {
      console.warn('ChunkLoadError caught by ErrorBoundary, redirecting to offline page...')
      // Instead of immediate reload, redirect to offline page for better UX
      window.location.href = '/offline'
      return
    }

    // Log error details for debugging
    if (process.env.NODE_ENV === 'development') {
      console.group('🐛 Error Boundary Details')
      console.error('Error:', error)
      console.error('Error Info:', errorInfo)
      console.error('Component Stack:', errorInfo.componentStack)
      console.groupEnd()
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error!} resetError={this.resetError} />
      }

      return (
        <Section className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardContent className="text-center p-8">
              <AlertTriangle className="mx-auto h-16 w-16 text-red-500 mb-6" />
              
              <Typography variant="h2" className="text-2xl font-bold text-gray-900 mb-4">
                Oops! Có lỗi xảy ra
              </Typography>
              
              <Typography className="text-gray-600 mb-6">
                Ứng dụng đã gặp lỗi không mong muốn. Vui lòng thử lại.
              </Typography>

              <Alert className="bg-red-50 border-red-200 mb-6 text-left">
                <AlertDescription>
                  <Typography className="text-sm text-red-700">
                    <strong>Chi tiết lỗi:</strong><br />
                    {this.state.error?.message || 'Unknown error'}
                  </Typography>
                </AlertDescription>
              </Alert>

              <Section className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={this.resetError} className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Thử lại
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.reload()}
                  className="flex items-center gap-2"
                >
                  Tải lại trang
                </Button>
              </Section>
            </CardContent>
          </Card>
        </Section>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

