import { ReactNode } from 'react'
import { useAuthStore } from '@/store/authStore'

export function AuthProvider({ children }: { children: ReactNode }) {
  // You can add logic here to sync user from localStorage/cookie if needed
  // Or fetch user profile on mount
  return children
}
