import { useState, useMemo, useEffect, useRef } from 'react'
import { useUIStore } from '../../stores/uiStore'
import { useCanvasStore } from '../../stores/canvasStore'
import { useTypographyStore } from '../../stores/typographyStore'
import { useColorStore } from '../../stores/colorStore'
import { sectionTemplates } from '../../data/sections'
import { fonts } from '../../data/fonts'
import { Modal } from './Modal'
import { Input } from './Input'
import { Search, Layout, Type, Palette, Settings, Download, Undo2, Redo2, Copy, Trash2, Sun, Moon } from 'lucide-react'

interface CommandItem {
  id: string
  label: string
  category: string
  icon: typeof Layout
  action: () => void
  shortcut?: string
}
const CommandPalette = () => {
  const { commandPaletteOpen, setCommandPaletteOpen, theme, toggleTheme, setExportModalOpen } = useUIStore()
  const { undo, redo, copy, paste, duplicate, deleteSelected, selectAll } = useCanvasStore()
  const { setHeadingFont, setBodyFont } = useTypographyStore()
  const { setActiveTheme, themes } = useColorStore()
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery('')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [commandPaletteOpen])
  const commands = useMemo<CommandItem[]>(() => {
    const items: CommandItem[] = [
      { id: 'undo', label: 'Undo', category: 'Actions', icon: Undo2, action: undo, shortcut: 'Cmd+Z' },
      { id: 'redo', label: 'Redo', category: 'Actions', icon: Redo2, action: redo, shortcut: 'Cmd+Shift+Z' },
      { id: 'copy', label: 'Copy', category: 'Actions', icon: Copy, action: copy, shortcut: 'Cmd+C' },
      { id: 'paste', label: 'Paste', category: 'Actions', icon: Copy, action: paste, shortcut: 'Cmd+V' },
      { id: 'duplicate', label: 'Duplicate', category: 'Actions', icon: Copy, action: duplicate, shortcut: 'Cmd+D' },
      { id: 'delete', label: 'Delete selected', category: 'Actions', icon: Trash2, action: deleteSelected, shortcut: 'Del' },
      { id: 'select-all', label: 'Select all', category: 'Actions', icon: Layout, action: selectAll, shortcut: 'Cmd+A' },
      { id: 'export', label: 'Export', category: 'Actions', icon: Download, action: () => setExportModalOpen(true), shortcut: 'Cmd+E' },
      { id: 'toggle-theme', label: theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode', category: 'Settings', icon: theme === 'light' ? Moon : Sun, action: toggleTheme },
    ]
    sectionTemplates.forEach((section) => {
      items.push({
        id: `section-${section.id}`,
        label: section.name,
        category: 'Sections',
        icon: Layout,
        action: () => {},
      })
    })
    fonts.slice(0, 30).forEach((font) => {
      items.push({
        id: `heading-font-${font.family}`,
        label: `Set heading: ${font.family}`,
        category: 'Fonts',
        icon: Type,
        action: () => setHeadingFont(font.family),
      })
      items.push({
        id: `body-font-${font.family}`,
        label: `Set body: ${font.family}`,
        category: 'Fonts',
        icon: Type,
        action: () => setBodyFont(font.family),
      })
    })
    themes.forEach((t) => {
      items.push({
        id: `theme-${t.id}`,
        label: `Apply theme: ${t.name}`,
        category: 'Themes',
        icon: Palette,
        action: () => setActiveTheme(t),
      })
    })
    return items
  }, [theme, undo, redo, copy, paste, duplicate, deleteSelected, selectAll, toggleTheme, setExportModalOpen, setHeadingFont, setBodyFont, setActiveTheme, themes])
  const filtered = useMemo(() => {
    if (!query) return commands.slice(0, 10)
    const q = query.toLowerCase()
    return commands.filter((c) => c.label.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)).slice(0, 15)
  }, [commands, query])
  const grouped = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {}
    filtered.forEach((item) => {
      if (!groups[item.category]) groups[item.category] = []
      groups[item.category].push(item)
    })
    return groups
  }, [filtered])
  const handleSelect = (item: CommandItem) => {
    item.action()
    setCommandPaletteOpen(false)
  }
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setCommandPaletteOpen(false)
    }
  }
  return (
    <Modal open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen} title="Command Palette" size="md">
      <div className="-mx-6 -mb-6">
        <div className="px-4 pb-3 border-b border-border">
          <Input
            ref={inputRef}
            placeholder="Search commands..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            icon={<Search size={14} />}
          />
        </div>
        <div className="max-h-80 overflow-y-auto py-2">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <div className="px-4 py-1.5">
                <span className="text-xs font-medium text-text-tertiary uppercase">{category}</span>
              </div>
              {items.map((item) => (
                <button
                  key={item.id}
                  className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-background-tertiary transition-colors"
                  onClick={() => handleSelect(item)}
                >
                  <item.icon size={16} className="text-text-tertiary" />
                  <span className="flex-1 text-sm text-text-primary">{item.label}</span>
                  {item.shortcut && (
                    <span className="text-xs text-text-tertiary bg-background-tertiary px-1.5 py-0.5 rounded">{item.shortcut}</span>
                  )}
                </button>
              ))}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-text-tertiary">No results found</p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}
export { CommandPalette }