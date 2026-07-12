import { create } from 'zustand'
import type { User, Scan, ScanWithVulns } from '@/types'
import { api } from '@/api/client'

interface AppStore {
  user: User | null
  scans: Scan[]
  currentScan: ScanWithVulns | null
  isLoading: boolean

  setUser: (user: User | null) => void
  setScans: (scans: Scan[]) => void
  addScan: (scan: Scan) => void
  updateScan: (scan: Scan) => void
  setCurrentScan: (scan: ScanWithVulns | null) => void
  setIsLoading: (loading: boolean) => void
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

export const useStore = create<AppStore>((set) => ({
  user: null,
  scans: [],
  currentScan: null,
  isLoading: false,

  setUser: (user) => set({ user }),
  setScans: (scans) => set({ scans }),
  addScan: (scan) => set((state) => ({ scans: [scan, ...state.scans] })),
  updateScan: (scan) =>
    set((state) => ({
      scans: state.scans.map((s) => (s.id === scan.id ? scan : s)),
    })),
  setCurrentScan: (scan) => set({ currentScan: scan }),
  setIsLoading: (loading) => set({ isLoading: loading }),

  logout: async () => {
    try { await api.logout() } catch {}
    set({ user: null, scans: [], currentScan: null })
  },

  checkAuth: async () => {
    try {
      const user = await api.getMe()
      set({ user })
    } catch {
      set({ user: null })
    }
  },
}))
