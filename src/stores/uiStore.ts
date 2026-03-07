import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type DevicePreview = 'mobile' | 'tablet' | 'laptop' | 'desktop' | 'wide'
type Mode = 'design' | 'preview' | 'code'
interface UIState {
  theme: 'light' | 'dark'
  leftPanelOpen: boolean
  rightPanelOpen: boolean
  leftPanelWidth: number
  rightPanelWidth: number
  commandPaletteOpen: boolean
  shortcutsModalOpen: boolean
  exportModalOpen: boolean
  devicePreview: DevicePreview
  mode: Mode
  showGrid: boolean
  projectName: string
  setTheme: (theme: 'light' | 'dark') => void
  toggleTheme: () => void
  setLeftPanelOpen: (open: boolean) => void
  setRightPanelOpen: (open: boolean) => void
  setCommandPaletteOpen: (open: boolean) => void
  setShortcutsModalOpen: (open: boolean) => void
  setExportModalOpen: (open: boolean) => void
  setDevicePreview: (device: DevicePreview) => void
  setMode: (mode: Mode) => void
  setShowGrid: (show: boolean) => void
  setProjectName: (name: string) => void
}
const deviceWidths: Record<DevicePreview, number> = {
  mobile: 375,
  tablet: 768,
  laptop: 1280,
  desktop: 1440,
  wide: 1920,
}
export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'light',
      leftPanelOpen: true,
      rightPanelOpen: true,
      leftPanelWidth: 280,
      rightPanelWidth: 320,
      commandPaletteOpen: false,
      shortcutsModalOpen: false,
      exportModalOpen: false,
      devicePreview: 'desktop',
      mode: 'design',
      showGrid: true,
      projectName: 'Untitled',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      setLeftPanelOpen: (leftPanelOpen) => set({ leftPanelOpen }),
      setRightPanelOpen: (rightPanelOpen) => set({ rightPanelOpen }),
      setCommandPaletteOpen: (commandPaletteOpen) => set({ commandPaletteOpen }),
      setShortcutsModalOpen: (shortcutsModalOpen) => set({ shortcutsModalOpen }),
      setExportModalOpen: (exportModalOpen) => set({ exportModalOpen }),
      setDevicePreview: (devicePreview) => set({ devicePreview }),
      setMode: (mode) => set({ mode }),
      setShowGrid: (showGrid) => set({ showGrid }),
      setProjectName: (projectName) => set({ projectName }),
    }),
    { name: 'designforge-ui' }
  )
)
export { deviceWidths }
export type { DevicePreview, Mode }