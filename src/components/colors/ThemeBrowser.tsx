import { useState, useMemo, useRef } from 'react'
import { useColorStore, ColorTheme } from '../../stores/colorStore'
import { Button } from '../ui'
import { Check, Trash2, ChevronDown, ChevronRight, Pipette, Save, AlertTriangle, X } from 'lucide-react'

interface ThemeBrowserProps { searchQuery: string }
const themeCategories = ['Professional', 'Minimalist', 'Bold', 'Warm', 'Dark', 'Nature', 'Tech', 'Luxury', 'Pastel']
const colorLabels: Record<keyof ColorTheme['colors'], string> = { primary: 'Primary', secondary: 'Secondary', accent: 'Accent', background: 'Background', surface: 'Surface', textPrimary: 'Text', textSecondary: 'Text 2', textOnPrimary: 'On Primary', border: 'Border', success: 'Success', warning: 'Warning', error: 'Error' }
interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  themeName: string
}
const ConfirmDialog = ({ isOpen, onClose, onConfirm, themeName }: ConfirmDialogProps) => {
  if (!isOpen) return null
  return (
    <div className="confirm-dialog-overlay" onClick={onClose}>
      <div className="confirm-dialog" onClick={e => e.stopPropagation()}>
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={20} className="text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-text-primary">Override Manual Colors?</h3>
            <p className="text-sm text-text-secondary mt-1">Applying "{themeName}" will replace your custom color selections. This action cannot be undone.</p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3">
          <button onClick={onConfirm} className="px-4 py-2 text-sm font-medium text-text-primary border border-border rounded-lg hover:bg-background-tertiary transition-colors">Yes, Override</button>
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-background-primary bg-accent rounded-lg hover:bg-accent-hover transition-colors">No, Keep Colors</button>
        </div>
      </div>
    </div>
  )
}
interface CustomColorPickerProps { onColorSelect: (color: string) => void }
const CustomColorPicker = ({ onColorSelect }: CustomColorPickerProps) => {
  const [hexInput, setHexInput] = useState('#3B82F6')
  const [isExpanded, setIsExpanded] = useState(true)
  const colorInputRef = useRef<HTMLInputElement>(null)
  const { recentColors, savedColors, addRecentColor, addSavedColor, removeSavedColor } = useColorStore()
  const isValidHex = (hex: string) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex)
  const handleHexChange = (value: string) => {
    let f = value.startsWith('#') ? value : `#${value}`
    f = f.toUpperCase()
    setHexInput(f)
    if (isValidHex(f)) { addRecentColor(f); onColorSelect(f) }
  }
  const handleNativePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => { const c = e.target.value.toUpperCase(); setHexInput(c); addRecentColor(c); onColorSelect(c) }
  const handleSaveColor = () => { if (isValidHex(hexInput)) addSavedColor(hexInput) }
  return (
    <div className="mb-4 bg-background-tertiary rounded-lg overflow-hidden">
      <button onClick={() => setIsExpanded(!isExpanded)} className="w-full flex items-center gap-2 py-3 px-4 hover:bg-border transition-colors">
        <div className={`w-6 h-6 flex items-center justify-center rounded bg-accent/10 transition-transform duration-200 ${isExpanded ? 'rotate-0' : '-rotate-90'}`}>
          <ChevronDown size={16} className="text-accent" />
        </div>
        <Pipette size={18} className="text-accent" />
        <h4 className="text-sm font-semibold text-text-primary flex-1 text-left">Custom Color</h4>
      </button>
      <div className={`overflow-hidden transition-all duration-200 ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 pb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-lg border-2 border-border cursor-pointer shadow-subtle overflow-hidden" style={{ backgroundColor: isValidHex(hexInput) ? hexInput : '#FFFFFF' }} onClick={() => colorInputRef.current?.click()}>
                <input ref={colorInputRef} type="color" value={hexInput} onChange={handleNativePickerChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex gap-2">
                <input type="text" value={hexInput} onChange={e => handleHexChange(e.target.value)} onFocus={e => e.target.select()} placeholder="#000000" maxLength={7} className={`flex-1 px-3 py-2.5 bg-background-secondary border rounded-md text-sm font-mono ${isValidHex(hexInput) ? 'border-border' : 'border-red-500'}`} />
                <button onClick={handleSaveColor} disabled={!isValidHex(hexInput)} title="Save color" className="w-10 h-10 flex items-center justify-center rounded-md border border-border hover:border-accent hover:bg-accent/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  <Save size={18} />
                </button>
              </div>
            </div>
          </div>
          {savedColors.length > 0 && (
            <div className="mb-3">
              <label className="text-xs font-medium text-text-secondary mb-1.5 block">Saved</label>
              <div className="flex flex-wrap gap-1.5">
                {savedColors.map(color => (
                  <div key={color} className="relative group">
                    <button className="w-8 h-8 rounded-md border border-border hover:border-accent transition-colors shadow-subtle" style={{ backgroundColor: color }} onClick={() => { setHexInput(color); onColorSelect(color) }} title={color} />
                    <button className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeSavedColor(color)}><X size={10} className="text-white" /></button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {recentColors.length > 0 && (
            <div>
              <label className="text-xs font-medium text-text-secondary mb-1.5 block">Recent</label>
              <div className="flex flex-wrap gap-1.5">
                {recentColors.slice(0, 8).map((color, i) => <button key={`${color}-${i}`} className="w-8 h-8 rounded-md border border-border hover:border-accent transition-colors shadow-subtle" style={{ backgroundColor: color }} onClick={() => { setHexInput(color); onColorSelect(color) }} title={color} />)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
interface ThemeColorEditorProps { theme: ColorTheme }
const ThemeColorEditor = ({ theme }: ThemeColorEditorProps) => {
  const { updateThemeColor } = useColorStore()
  const [isExpanded, setIsExpanded] = useState(false)
  const colorInputRefs = useRef<Record<string, HTMLInputElement | null>>({})
  const handleColorChange = (k: keyof ColorTheme['colors'], v: string) => updateThemeColor(k, v.toUpperCase())
  return (
    <div className="mt-3 pt-3 border-t border-border">
      <button onClick={() => setIsExpanded(!isExpanded)} className="flex items-center gap-2 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors">
        <div className={`transition-transform duration-200 ${isExpanded ? 'rotate-0' : '-rotate-90'}`}><ChevronDown size={14} /></div>
        Edit Colors
      </button>
      <div className={`overflow-hidden transition-all duration-200 ${isExpanded ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
        <div className="grid grid-cols-3 gap-1.5">
          {(Object.entries(theme.colors) as [keyof ColorTheme['colors'], string][]).map(([k, c]) => (
            <div key={k} className="flex items-center gap-1.5">
              <div className="relative">
                <button className="w-6 h-6 rounded border border-border shadow-subtle overflow-hidden" style={{ backgroundColor: c }} onClick={() => colorInputRefs.current[k]?.click()} />
                <input ref={el => { colorInputRefs.current[k] = el }} type="color" value={c} onChange={e => handleColorChange(k, e.target.value)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              </div>
              <span className="text-[10px] text-text-tertiary truncate">{colorLabels[k]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
interface ThemeCardProps { theme: ColorTheme; isActive: boolean; onSelect: () => void }
const ThemeCard = ({ theme, isActive, onSelect }: ThemeCardProps) => {
  const c = theme.colors
  return (
    <div className={`group p-3 rounded-lg border-2 transition-all cursor-pointer ${isActive ? 'border-accent bg-background-secondary shadow-elevated' : 'border-border hover:border-text-tertiary hover:shadow-subtle'}`} onClick={onSelect}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-text-primary">{theme.name}</span>
        {isActive && <Check size={18} className="text-accent" />}
      </div>
      <div className="flex gap-1.5 mb-2">
        {[c.primary, c.secondary, c.accent, c.background].map((col, i) => <div key={i} className={`w-8 h-8 rounded shadow-subtle ${i === 3 ? 'border border-border' : ''}`} style={{ backgroundColor: col }} />)}
      </div>
      <div className="h-14 rounded p-2 flex flex-col justify-between" style={{ backgroundColor: c.background }}>
        <span className="text-xs font-semibold truncate" style={{ color: c.textPrimary }}>Preview Text</span>
        <div className="flex gap-1">
          <div className="h-4 px-2 rounded text-[10px] flex items-center font-medium" style={{ backgroundColor: c.primary, color: c.textOnPrimary }}>Button</div>
          <div className="h-4 px-2 rounded text-[10px] flex items-center border" style={{ borderColor: c.border, color: c.textPrimary }}>Alt</div>
        </div>
      </div>
      {isActive && <ThemeColorEditor theme={theme} />}
    </div>
  )
}
interface CollapsibleThemeCategoryProps { category: string; themes: ColorTheme[]; activeThemeId: string; activeTheme: ColorTheme; onSelectTheme: (theme: ColorTheme) => void; hasManualColors: boolean; onShowConfirm: (theme: ColorTheme) => void }
const CollapsibleThemeCategory = ({ category, themes, activeThemeId, activeTheme, onSelectTheme, hasManualColors, onShowConfirm }: CollapsibleThemeCategoryProps) => {
  const [isExpanded, setIsExpanded] = useState(true)
  const handleThemeClick = (theme: ColorTheme) => {
    if (hasManualColors && activeThemeId !== theme.id) {
      onShowConfirm(theme)
    } else {
      onSelectTheme(theme)
    }
  }
  return (
    <div className="mb-4">
      <button onClick={() => setIsExpanded(!isExpanded)} className="w-full flex items-center gap-2 py-2 px-3 rounded-lg bg-background-tertiary hover:bg-border transition-colors mb-2">
        <div className={`w-6 h-6 flex items-center justify-center rounded bg-accent/10 transition-transform duration-200 ${isExpanded ? 'rotate-0' : '-rotate-90'}`}>
          <ChevronDown size={16} className="text-accent" />
        </div>
        <h4 className="text-sm font-semibold text-text-primary uppercase tracking-wide flex-1 text-left">{category}</h4>
        <span className="text-xs text-text-tertiary bg-background-secondary px-2 py-0.5 rounded">{themes.length}</span>
      </button>
      <div className={`overflow-hidden transition-all duration-200 ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="grid grid-cols-1 gap-2">
          {themes.map(t => <ThemeCard key={t.id} theme={activeThemeId === t.id ? activeTheme : t} isActive={activeThemeId === t.id} onSelect={() => handleThemeClick(t)} />)}
        </div>
      </div>
    </div>
  )
}
const ThemeBrowser = ({ searchQuery }: ThemeBrowserProps) => {
  const { activeTheme, themes, setActiveTheme, updateThemeColor, recentColors } = useColorStore()
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [pendingTheme, setPendingTheme] = useState<ColorTheme | null>(null)
  const hasManualColors = recentColors.length > 0
  const filteredThemes = useMemo(() => {
    let r = themes
    if (activeCategory) r = r.filter(t => t.category === activeCategory)
    if (searchQuery) { const q = searchQuery.toLowerCase(); r = r.filter(t => t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)) }
    return r
  }, [themes, activeCategory, searchQuery])
  const groupedThemes = useMemo(() => {
    const g: Record<string, ColorTheme[]> = {}
    filteredThemes.forEach(t => { if (!g[t.category]) g[t.category] = []; g[t.category].push(t) })
    return g
  }, [filteredThemes])
  const handleCustomColorSelect = (color: string) => updateThemeColor('primary', color)
  const handleShowConfirm = (theme: ColorTheme) => {
    setPendingTheme(theme)
    setShowConfirmDialog(true)
  }
  const handleConfirmOverride = () => {
    if (pendingTheme) {
      setActiveTheme(pendingTheme)
      setPendingTheme(null)
    }
    setShowConfirmDialog(false)
  }
  return (
    <div className="p-3">
      <CustomColorPicker onColorSelect={handleCustomColorSelect} />
      <div className="grid grid-cols-3 gap-1 mb-3 p-1 bg-background-tertiary rounded-lg">
        <button onClick={() => setActiveCategory(null)} className={`py-2 px-2 rounded text-xs font-medium transition-colors ${activeCategory === null ? 'bg-accent text-background-primary' : 'text-text-secondary hover:bg-background-secondary'}`}>All</button>
        {themeCategories.slice(0, 2).map(cat => <button key={cat} onClick={() => setActiveCategory(cat)} className={`py-2 px-2 rounded text-xs font-medium transition-colors truncate ${activeCategory === cat ? 'bg-accent text-background-primary' : 'text-text-secondary hover:bg-background-secondary'}`}>{cat}</button>)}
      </div>
      <div className="grid grid-cols-3 gap-1 mb-3 p-1 bg-background-tertiary rounded-lg">
        {themeCategories.slice(2, 5).map(cat => <button key={cat} onClick={() => setActiveCategory(cat)} className={`py-2 px-2 rounded text-xs font-medium transition-colors truncate ${activeCategory === cat ? 'bg-accent text-background-primary' : 'text-text-secondary hover:bg-background-secondary'}`}>{cat}</button>)}
      </div>
      <div className="grid grid-cols-3 gap-1 mb-4 p-1 bg-background-tertiary rounded-lg">
        {themeCategories.slice(5, 8).map(cat => <button key={cat} onClick={() => setActiveCategory(cat)} className={`py-2 px-2 rounded text-xs font-medium transition-colors truncate ${activeCategory === cat ? 'bg-accent text-background-primary' : 'text-text-secondary hover:bg-background-secondary'}`}>{cat}</button>)}
        {themeCategories.length > 8 && themeCategories.slice(8).map(cat => <button key={cat} onClick={() => setActiveCategory(cat)} className={`py-2 px-2 rounded text-xs font-medium transition-colors truncate ${activeCategory === cat ? 'bg-accent text-background-primary' : 'text-text-secondary hover:bg-background-secondary'}`}>{cat}</button>)}
      </div>
      <div className="space-y-1">
        {Object.entries(groupedThemes).map(([c, ts]) => <CollapsibleThemeCategory key={c} category={c} themes={ts} activeThemeId={activeTheme.id} activeTheme={activeTheme} onSelectTheme={setActiveTheme} hasManualColors={hasManualColors} onShowConfirm={handleShowConfirm} />)}
      </div>
      {filteredThemes.length === 0 && <div className="text-center py-12"><p className="text-sm text-text-tertiary">No themes found</p></div>}
      <ConfirmDialog isOpen={showConfirmDialog} onClose={() => setShowConfirmDialog(false)} onConfirm={handleConfirmOverride} themeName={pendingTheme?.name || ''} />
    </div>
  )
}
export { ThemeBrowser }