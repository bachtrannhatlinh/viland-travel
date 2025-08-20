import { create } from 'zustand'

export interface BookingItem {
  id: string
  type: 'tour' | 'flight' | 'hotel' | 'car' // loại dịch vụ
  name: string
  details?: any // tuỳ ý, có thể refine sau
  quantity?: number
  price?: number
}

interface BookingState {
  items: BookingItem[]
  addItem: (item: BookingItem) => void
  removeItem: (id: string) => void
  clear: () => void
  updateItem: (id: string, data: Partial<BookingItem>) => void
}

export const useBookingStore = create<BookingState>((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (id) => set((state) => ({ items: state.items.filter(i => i.id !== id) })),
  clear: () => set({ items: [] }),
  updateItem: (id, data) => set((state) => ({
    items: state.items.map(i => i.id === id ? { ...i, ...data } : i)
  })),
}))
