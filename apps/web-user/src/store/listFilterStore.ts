import { create } from 'zustand'

export interface ListFilterState {
  search: string
  sort: string
  filters: Record<string, any>
  setSearch: (search: string) => void
  setSort: (sort: string) => void
  setFilter: (key: string, value: any) => void
  reset: () => void
}

export const useListFilterStore = create<ListFilterState>((set) => ({
  search: '',
  sort: '',
  filters: {},
  setSearch: (search) => set({ search }),
  setSort: (sort) => set({ sort }),
  setFilter: (key, value) => set((state) => ({ filters: { ...state.filters, [key]: value } })),
  reset: () => set({ search: '', sort: '', filters: {} }),
}))
