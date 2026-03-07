import { useEffect } from 'react'
import { useCanvasStore } from '../stores/canvasStore'
import { useUIStore } from '../stores/uiStore'

export const useKeyboardShortcuts = () => {
  const { undo, redo, copy, paste, duplicate, deleteSelected, selectAll, moveSelected, setZoom, zoom } = useCanvasStore()
  const { setCommandPaletteOpen, toggleTheme, setExportModalOpen, setShortcutsModalOpen } = useUIStore()
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable
      const isMeta = e.metaKey || e.ctrlKey
      if ((e.key === 'k' || e.key === '/') && isMeta) { e.preventDefault(); setCommandPaletteOpen(true); return }
      if (e.key === '?' && !isMeta) { e.preventDefault(); setShortcutsModalOpen(true); return }
      if (isInput) return
      if (e.key === 'z' && isMeta && e.shiftKey) { e.preventDefault(); redo(); return }
      if (e.key === 'z' && isMeta) { e.preventDefault(); undo(); return }
      if (e.key === 'c' && isMeta) { e.preventDefault(); copy(); return }
      if (e.key === 'v' && isMeta) { e.preventDefault(); paste(); return }
      if (e.key === 'd' && isMeta) { e.preventDefault(); duplicate(); return }
      if (e.key === 'a' && isMeta) { e.preventDefault(); selectAll(); return }
      if (e.key === 'e' && isMeta) { e.preventDefault(); setExportModalOpen(true); return }
      if (e.key === 'Backspace' || e.key === 'Delete') { e.preventDefault(); deleteSelected(); return }
      if (e.key === 'Escape') { useCanvasStore.getState().clearSelection(); return }
      if (e.key === '=' && isMeta) { e.preventDefault(); setZoom(zoom + 0.1); return }
      if (e.key === '-' && isMeta) { e.preventDefault(); setZoom(zoom - 0.1); return }
      if ((e.key === '0' || e.key === '1') && isMeta) { e.preventDefault(); setZoom(1); return }

      const n = e.shiftKey ? 10 : 1
      if (e.key === 'ArrowUp') { e.preventDefault(); moveSelected(0, -n); return }
      if (e.key === 'ArrowDown') { e.preventDefault(); moveSelected(0, n); return }
      if (e.key === 'ArrowLeft') { e.preventDefault(); moveSelected(-n, 0); return }
      if (e.key === 'ArrowRight') { e.preventDefault(); moveSelected(n, 0); return }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undo, redo, copy, paste, duplicate, deleteSelected, selectAll, moveSelected, setZoom, zoom, setCommandPaletteOpen, toggleTheme, setExportModalOpen, setShortcutsModalOpen])
}