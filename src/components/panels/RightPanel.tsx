import { useState, useRef, useEffect } from 'react'
import { useUIStore } from '../../stores/uiStore'
import { useCanvasStore } from '../../stores/canvasStore'
import { useColorStore } from '../../stores/colorStore'
import { Panel } from '../ui'
import { LayerList } from './LayerList'
import { ElementProperties } from './ElementProperties'
import { Pipette, ChevronDown, ChevronRight, Sparkles, Palette, Crown, Gem, Moon, Sun, Waves, X } from 'lucide-react'
import * as Accordion from '@radix-ui/react-accordion'

const luxuryBackgroundColors = {
  'Classic Neutrals': [
    { name: 'Pure White', color: '#FFFFFF' },
    { name: 'Snow', color: '#FFFAFA' },
    { name: 'Ivory', color: '#FFFFF0' },
    { name: 'Linen', color: '#FAF0E6' },
    { name: 'Seashell', color: '#FFF5EE' },
    { name: 'Cream', color: '#FFFDD0' },
    { name: 'Antique White', color: '#FAEBD7' },
    { name: 'Pearl', color: '#F8F6F0' },
  ],
  'Elegant Darks': [
    { name: 'Rich Black', color: '#0A0A0A' },
    { name: 'Onyx', color: '#0F0F0F' },
    { name: 'Charcoal', color: '#1A1A1A' },
    { name: 'Midnight', color: '#121212' },
    { name: 'Obsidian', color: '#0B1215' },
    { name: 'Deep Navy', color: '#0A192F' },
    { name: 'Dark Slate', color: '#1E293B' },
    { name: 'Carbon', color: '#171717' },
  ],
  'Luxury Warm': [
    { name: 'Champagne', color: '#F7E7CE' },
    { name: 'Blush', color: '#FFF0F5' },
    { name: 'Rose Quartz', color: '#F7CAC9' },
    { name: 'Peach', color: '#FFDAB9' },
    { name: 'Apricot', color: '#FBCEB1' },
    { name: 'Bisque', color: '#FFE4C4' },
    { name: 'Lavender Blush', color: '#FFF0F5' },
    { name: 'Misty Rose', color: '#FFE4E1' },
  ],
  'Luxury Cool': [
    { name: 'Alice Blue', color: '#F0F8FF' },
    { name: 'Ghost White', color: '#F8F8FF' },
    { name: 'Mint Cream', color: '#F5FFFA' },
    { name: 'Azure', color: '#F0FFFF' },
    { name: 'Honeydew', color: '#F0FFF0' },
    { name: 'Pale Turquoise', color: '#E0FFFF' },
    { name: 'Ice Blue', color: '#E8F4F8' },
    { name: 'Powder Blue', color: '#E6F3F7' },
  ],
  'Premium Gold & Metallics': [
    { name: 'Champagne Gold', color: '#F5E6D3' },
    { name: 'Rose Gold', color: '#F5E1DA' },
    { name: 'Silver Mist', color: '#E8E8E8' },
    { name: 'Platinum', color: '#E5E4E2' },
    { name: 'Warm Gold', color: '#F9F2E7' },
    { name: 'Copper Glow', color: '#F5E5DC' },
    { name: 'Bronze', color: '#F0E6DC' },
    { name: 'Titanium', color: '#E0E0E0' },
  ],
  'Sophisticated Grays': [
    { name: 'Smoke', color: '#F5F5F5' },
    { name: 'Platinum Gray', color: '#E5E4E2' },
    { name: 'Silver', color: '#D3D3D3' },
    { name: 'Cool Gray', color: '#C4C4C4' },
    { name: 'Dove Gray', color: '#B0B0B0' },
    { name: 'Slate Gray', color: '#708090' },
    { name: 'Gunmetal', color: '#2C3539' },
    { name: 'Graphite', color: '#383838' },
  ],
}
const categoryIcons: Record<string, React.ComponentType<{ size: number; className?: string }>> = {
  'Classic Neutrals': Sun,
  'Elegant Darks': Moon,
  'Luxury Warm': Sparkles,
  'Luxury Cool': Waves,
  'Premium Gold & Metallics': Crown,
  'Sophisticated Grays': Gem,
}
const AccordionItem = ({ value, title, icon: Icon, children }: { value: string; title: string; icon?: React.ComponentType<{ size: number; className?: string }>; children: React.ReactNode }) => (
  <Accordion.Item value={value} className="border-b border-border">
    <Accordion.Header>
      <Accordion.Trigger className="flex items-center justify-between w-full p-4 text-sm font-medium text-text-primary hover:bg-background-tertiary transition-colors group">
        <div className="flex items-center gap-2">
          {Icon && <Icon size={18} className="text-accent" />}
          <span>{title}</span>
        </div>
        <ChevronDown size={18} className="text-text-tertiary transition-transform duration-200 group-data-[state=open]:rotate-180" />
      </Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
      <div className="px-4 pb-4">{children}</div>
    </Accordion.Content>
  </Accordion.Item>
)
const CanvasBackgroundPicker = () => {
  const colorInputRef = useRef<HTMLInputElement>(null)
  const { pages, currentPageId, setPageBackgroundColor, getPageBackgroundColor } = useCanvasStore()
  const { recentColors, addRecentColor, savedColors, addSavedColor, removeSavedColor } = useColorStore()

  const currentBg = getPageBackgroundColor(currentPageId) || '#FFFFFF'

  const [hexInput, setHexInput] = useState(currentBg)

  useEffect(() => {
    setHexInput(currentBg)
  }, [currentBg, currentPageId])

  const isValidHex = (hex: string) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex)

  const handleColorChange = (color: string) => {
    setPageBackgroundColor(currentPageId, color)
    addRecentColor(color)
  }

  const handleNativeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const c = e.target.value.toUpperCase()
    setHexInput(c)
    handleColorChange(c)
  }

  const handleHexInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value
    if (!val.startsWith('#')) val = '#' + val
    setHexInput(val.toUpperCase())
    if (isValidHex(val)) handleColorChange(val.toUpperCase())
  }

  return (
    <div className="space-y-4">
      {/* Removed duplicate "Custom Background Color" label/icon header here */}
      <div className="flex items-center gap-2">
        <button className="w-14 h-14 rounded-lg border-2 border-border cursor-pointer shadow-subtle hover:border-accent transition-colors flex-shrink-0" style={{ backgroundColor: isValidHex(hexInput) ? hexInput : '#FFFFFF' }} onClick={() => colorInputRef.current?.click()}>
          <input ref={colorInputRef} type="color" value={hexInput} onChange={handleNativeChange} className="absolute w-0 h-0 opacity-0" />
        </button>
        <input type="text" value={hexInput} onChange={handleHexInput} placeholder="#FFFFFF" maxLength={7} className={`flex-1 px-3 py-3 bg-background-secondary border rounded-md text-sm font-mono ${isValidHex(hexInput) ? 'border-border' : 'border-red-500'}`} onFocus={e => e.target.select()} />
      </div>
      {savedColors.length > 0 && (
        <div>
          <label className="text-xs text-text-tertiary mb-2 block">Saved Colors</label>
          <div className="flex flex-wrap gap-2">
            {savedColors.map(color => (
              <div key={color} className="relative group">
                <button className="w-9 h-9 rounded-md border border-border hover:border-accent transition-colors shadow-subtle" style={{ backgroundColor: color }} onClick={() => handleColorChange(color)} title={color} />
                <button className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs" onClick={() => removeSavedColor(color)}>x</button>
              </div>
            ))}
          </div>
        </div>
      )}
      {recentColors.length > 0 && (
        <div>
          <label className="text-xs text-text-tertiary mb-2 block">Recent Colors</label>
          <div className="flex flex-wrap gap-2">
            {recentColors.slice(0, 8).map((color, i) => <button key={`${color}-${i}`} className="w-9 h-9 rounded-md border border-border hover:border-accent transition-colors shadow-subtle" style={{ backgroundColor: color }} onClick={() => handleColorChange(color)} title={color} />)}
          </div>
        </div>
      )}
    </div>
  )
}
const LuxuryColorCategory = ({ category, colors, onSelect, currentColor }: { category: string; colors: { name: string; color: string }[]; onSelect: (color: string) => void; currentColor: string }) => {
  const [isExpanded, setIsExpanded] = useState(true)
  const Icon = categoryIcons[category] || Palette
  return (
    <div className="mb-4">
      <button onClick={() => setIsExpanded(!isExpanded)} className="w-full flex items-center gap-2 py-2 px-3 rounded-lg bg-background-tertiary/50 hover:bg-background-tertiary transition-colors mb-2">
        <div className={`w-6 h-6 flex items-center justify-center rounded bg-accent/10 transition-transform duration-200 ${isExpanded ? 'rotate-0' : '-rotate-90'}`}>
          <ChevronDown size={16} className="text-accent" />
        </div>
        <Icon size={16} className="text-text-secondary" />
        <span className="text-sm font-medium text-text-primary flex-1 text-left">{category}</span>
        <span className="text-xs text-text-tertiary">{colors.length}</span>
      </button>
      <div className={`grid grid-cols-4 gap-2 pl-2 overflow-hidden transition-all duration-200 ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        {colors.map(({ name, color }) => (
          <button key={color} className={`group relative w-full aspect-square rounded-lg border-2 transition-all shadow-subtle hover:scale-105 ${currentColor === color ? 'border-accent ring-2 ring-accent/20' : 'border-border hover:border-accent'}`} style={{ backgroundColor: color }} onClick={() => onSelect(color)} title={name}>
            <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-[10px] font-medium px-1 py-0.5 rounded bg-black/70 text-white whitespace-nowrap">{name}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
const CanvasBackgroundPanel = () => {
  const { currentPageId, setPageBackgroundColor, getPageBackgroundColor } = useCanvasStore()
  const { addRecentColor, activeTheme } = useColorStore()

  const currentBg = getPageBackgroundColor(currentPageId) || '#FFFFFF'

  const handleColorSelect = (color: string) => {
    setPageBackgroundColor(currentPageId, color)
    addRecentColor(color)
  }
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Palette size={20} className="text-accent" />
          <h3 className="text-base font-semibold text-text-primary">Canvas Background</h3>
        </div>
        <p className="text-xs text-text-tertiary mt-1">Click empty canvas area to show this panel</p>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <Accordion.Root type="multiple" defaultValue={['customColor', 'luxuryColors', 'themeColors']}>
          <AccordionItem value="customColor" title="Custom Color" icon={Pipette}>
            <CanvasBackgroundPicker />
          </AccordionItem>
          <AccordionItem value="luxuryColors" title="Premium Backgrounds" icon={Crown}>
            <div className="space-y-2">
              {Object.entries(luxuryBackgroundColors).map(([category, colors]) => <LuxuryColorCategory key={category} category={category} colors={colors} onSelect={handleColorSelect} currentColor={currentBg} />)}
            </div>
          </AccordionItem>
          <AccordionItem value="themeColors" title="Theme Colors" icon={Palette}>
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(activeTheme.colors).map(([key, color]) => <button key={key} className={`w-full aspect-square rounded-lg border-2 transition-all shadow-subtle hover:scale-105 ${currentBg === color ? 'border-accent ring-2 ring-accent/20' : 'border-border hover:border-accent'}`} style={{ backgroundColor: color }} title={key} onClick={() => handleColorSelect(color)} />)}
            </div>
            <p className="text-xs text-text-tertiary mt-3">Colors from your active theme</p>
          </AccordionItem>
        </Accordion.Root>
      </div>
    </div>
  )
}
interface RightPanelProps {
  isMobile?: boolean
  isTablet?: boolean
}
const RightPanel = ({ isMobile = false, isTablet = false }: RightPanelProps) => {
  const { rightPanelOpen, rightPanelWidth, setRightPanelOpen } = useUIStore()
  const { selectedIds, pages, currentPageId } = useCanvasStore()
  const currentPage = pages.find(p => p.id === currentPageId)
  const elements = currentPage?.elements || []
  const selectedElements = elements.filter(el => selectedIds.includes(el.id))
  const hasSelection = selectedElements.length > 0
  const isSmallScreen = isMobile || isTablet
  return (
    <Panel side="right" isOpen={rightPanelOpen} width={isSmallScreen ? Math.min(rightPanelWidth, typeof window !== 'undefined' ? window.innerWidth - 40 : rightPanelWidth) : rightPanelWidth} isMobile={isMobile} isTablet={isTablet}>
      <div className="h-full flex flex-col border-l-2 border-border">
        {isSmallScreen && (
          <div className="flex flex-col items-center pt-2 pb-1 border-b border-border bg-background-tertiary/50">
            <div className="w-10 h-1 rounded-full bg-border mb-2" />
            <div className="flex items-center justify-between w-full px-3">
              <span className="font-semibold text-text-primary">{hasSelection ? 'Properties' : 'Background'}</span>
              <button onClick={() => setRightPanelOpen(false)} className="p-2 rounded-lg hover:bg-background-tertiary text-text-secondary hover:text-text-primary transition-colors">
                <X size={20} />
              </button>
            </div>
          </div>
        )}
        {hasSelection ? (
          <ElementProperties elements={selectedElements} />
        ) : (
          <div className="flex flex-col h-full">
            <CanvasBackgroundPanel />
            <div className="border-t-2 border-border">
              <div className="p-3 border-b border-border bg-background-tertiary/30">
                <h3 className="text-sm font-semibold text-text-primary">Layers</h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <LayerList />
              </div>
            </div>
          </div>
        )}
      </div>
    </Panel>
  )
}
export { RightPanel }