import { useState, useRef, useEffect } from 'react'
import { CanvasElement, useCanvasStore } from '../../stores/canvasStore'
import { useColorStore } from '../../stores/colorStore'
import { Input, Button } from '../ui'
import { Trash2, Copy, Lock, Unlock, EyeOff, Eye, ArrowUpToLine, ArrowDownToLine, ChevronDown, Pipette, Save } from 'lucide-react'
import * as Accordion from '@radix-ui/react-accordion'
import { fonts } from '../../data/fonts'

interface ElementPropertiesProps { elements: CanvasElement[] }
const AccordionItem = ({ value, title, children }: { value: string; title: string; children: React.ReactNode }) => (
  <Accordion.Item value={value} className="border-b border-border">
    <Accordion.Header>
      <Accordion.Trigger className="flex items-center justify-between w-full p-4 text-sm font-medium text-text-primary hover:bg-background-tertiary transition-colors group">
        {title}
        <ChevronDown size={18} className="text-text-tertiary transition-transform group-data-[state=open]:rotate-180" />
      </Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content className="overflow-hidden data-[state=open]:animate-slide-down data-[state=closed]:animate-slide-up">
      <div className="px-4 pb-4">{children}</div>
    </Accordion.Content>
  </Accordion.Item>
)
interface ColorPickerProps {
  label: string
  value: string
  onChange: (color: string) => void
}
const ColorPicker = ({ label, value, onChange }: ColorPickerProps) => {
  const colorInputRef = useRef<HTMLInputElement>(null)
  const [hexInput, setHexInput] = useState(value)
  useEffect(() => {
    setHexInput(value)
  }, [value])
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value.toUpperCase()
    setHexInput(newColor)
    onChange(newColor)
  }
  const handleHexInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value
    if (!val.startsWith('#')) val = '#' + val
    setHexInput(val.toUpperCase())
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(val)) {
      onChange(val.toUpperCase())
    }
  }
  return (
    <div className="flex items-center gap-3">
      <label className="text-sm text-text-secondary w-20 flex-shrink-0">{label}</label>
      <div className="flex items-center gap-2 flex-1">
        <button
          className="w-10 h-10 rounded-lg border-2 border-border cursor-pointer shadow-subtle hover:border-accent transition-colors flex-shrink-0"
          style={{ backgroundColor: value }}
          onClick={() => colorInputRef.current?.click()}
        >
          <input
            ref={colorInputRef}
            type="color"
            value={value}
            onChange={handleColorChange}
            className="absolute w-0 h-0 opacity-0"
          />
        </button>
        <input
          type="text"
          value={hexInput}
          onChange={handleHexInput}
          onFocus={e => e.target.select()}
          placeholder="#000000"
          maxLength={7}
          className="flex-1 px-3 py-2 bg-background-secondary border border-border rounded-md text-sm font-mono min-w-0"
        />
      </div>
    </div>
  )
}
const FontSelector = ({ value, onChange }: { value: string; onChange: (font: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const filteredFonts = fonts.filter(f =>
    f.family.toLowerCase().includes(search.toLowerCase())
  )
  return (
    <div className="relative">
      <button
        className="w-full px-3 py-2.5 bg-background-secondary border border-border rounded-md text-sm text-left flex items-center justify-between hover:border-accent transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span style={{ fontFamily: value }}>{value}</span>
        <ChevronDown size={16} className={`text-text-tertiary transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background-secondary border border-border rounded-lg shadow-elevated z-50 max-h-64 overflow-hidden">
          <div className="p-2 border-b border-border">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search fonts..."
              className="w-full px-3 py-2 bg-background-tertiary border border-border rounded-md text-sm"
              autoFocus
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filteredFonts.map(font => (
              <button
                key={font.family}
                className={`w-full px-3 py-2.5 text-left text-sm hover:bg-background-tertiary transition-colors ${value === font.family ? 'bg-selection' : ''}`}
                style={{ fontFamily: font.family }}
                onClick={() => { onChange(font.family); setIsOpen(false); setSearch('') }}
              >
                {font.family}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
const ManualColorPicker = ({ onColorSelect }: { onColorSelect: (color: string) => void }) => {
  const colorInputRef = useRef<HTMLInputElement>(null)
  const [hexInput, setHexInput] = useState('#3B82F6')
  const { savedColors, addSavedColor, removeSavedColor, recentColors, addRecentColor } = useColorStore()
  const isValidHex = (hex: string) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex)
  const handleNativeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const c = e.target.value.toUpperCase()
    setHexInput(c)
    addRecentColor(c)
    onColorSelect(c)
  }
  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value
    if (!val.startsWith('#')) val = '#' + val
    val = val.toUpperCase()
    setHexInput(val)
    if (isValidHex(val)) {
      addRecentColor(val)
      onColorSelect(val)
    }
  }
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Pipette size={18} className="text-accent flex-shrink-0" />
        <span className="text-sm font-medium text-text-primary">Custom Color</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          className="w-12 h-12 rounded-lg border-2 border-border cursor-pointer shadow-subtle hover:border-accent transition-colors flex-shrink-0"
          style={{ backgroundColor: isValidHex(hexInput) ? hexInput : '#FFFFFF' }}
          onClick={() => colorInputRef.current?.click()}
        >
          <input
            ref={colorInputRef}
            type="color"
            value={hexInput}
            onChange={handleNativeChange}
            className="absolute w-0 h-0 opacity-0"
          />
        </button>
        <input
          type="text"
          value={hexInput}
          onChange={handleHexInputChange}
          onFocus={e => e.target.select()}
          placeholder="#000000"
          maxLength={7}
          className={`flex-1 px-3 py-3 bg-background-secondary border rounded-md text-sm font-mono ${isValidHex(hexInput) ? 'border-border' : 'border-red-500'}`}
        />
        <button
          onClick={() => isValidHex(hexInput) && addSavedColor(hexInput)}
          disabled={!isValidHex(hexInput)}
          title="Save color"
          className="w-10 h-10 flex items-center justify-center rounded-md border border-border hover:border-accent hover:bg-accent/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={20} />
        </button>
      </div>
      {savedColors.length > 0 && (
        <div>
          <label className="text-xs text-text-tertiary mb-2 block">Saved Colors</label>
          <div className="flex flex-wrap gap-2">
            {savedColors.map(color => (
              <div key={color} className="relative group">
                <button
                  className="w-8 h-8 rounded-md border border-border hover:border-accent transition-colors shadow-subtle"
                  style={{ backgroundColor: color }}
                  onClick={() => { setHexInput(color); onColorSelect(color) }}
                  title={color}
                />
                <button
                  className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs"
                  onClick={() => removeSavedColor(color)}
                >×</button>
              </div>
            ))}
          </div>
        </div>
      )}
      {recentColors.length > 0 && (
        <div>
          <label className="text-xs text-text-tertiary mb-2 block">Recent Colors</label>
          <div className="flex flex-wrap gap-2">
            {recentColors.slice(0, 8).map((color, i) => (
              <button
                key={`${color}-${i}`}
                className="w-8 h-8 rounded-md border border-border hover:border-accent transition-colors shadow-subtle"
                style={{ backgroundColor: color }}
                onClick={() => { setHexInput(color); onColorSelect(color) }}
                title={color}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
const ElementProperties = ({ elements }: ElementPropertiesProps) => {
  const { updateElement, duplicate, deleteSelected, bringToFront, sendToBack, toggleLock, toggleVisibility } = useCanvasStore()
  const { activeTheme } = useColorStore()
  const single = elements.length === 1
  const element = elements[0]
  const isTextElement = element?.type === 'text'
  const isShapeElement = element?.type === 'shape'
  const isSectionElement = element?.type === 'section'
  const updateContent = (key: string, value: unknown) => {
    if (!single) return
    updateElement(element.id, {
      content: { ...element.content, [key]: value }
    })
  }
  const handleManualColorSelect = (color: string) => {
    if (!single) return
    if (isTextElement) updateContent('color', color)
    else if (isShapeElement) updateContent('fill', color)
    else if (isSectionElement) updateContent('backgroundColor', color)
  }
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-text-primary">
            {single ? (element.sectionType || (element.content?.text as string)?.substring(0, 15) || element.type) : `${elements.length} selected`}
          </h3>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="md" onClick={duplicate} title="Duplicate"><Copy size={20} /></Button>
            <Button variant="ghost" size="md" onClick={deleteSelected} title="Delete"><Trash2 size={20} /></Button>
          </div>
        </div>
        {single && (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="md" onClick={() => toggleVisibility(element.id)} title={element.visible ? 'Hide' : 'Show'}>
              {element.visible ? <Eye size={20} /> : <EyeOff size={20} />}
            </Button>
            <Button variant="ghost" size="md" onClick={() => toggleLock(element.id)} title={element.locked ? 'Unlock' : 'Lock'}>
              {element.locked ? <Lock size={20} /> : <Unlock size={20} />}
            </Button>
            <Button variant="ghost" size="md" onClick={bringToFront} title="Bring to Front"><ArrowUpToLine size={20} /></Button>
            <Button variant="ghost" size="md" onClick={sendToBack} title="Send to Back"><ArrowDownToLine size={20} /></Button>
          </div>
        )}
      </div>
      <div className="flex-1 overflow-y-auto">
        <Accordion.Root type="multiple" defaultValue={['position', 'size', 'text', 'fill', 'background', 'customColor', 'themeColors']}>
          {single && (
            <>
              <AccordionItem value="position" title="Position">
                <div className="grid grid-cols-2 gap-3">
                  <Input label="X" type="number" value={Math.round(element.x)} onChange={e => updateElement(element.id, { x: Number(e.target.value) })} />
                  <Input label="Y" type="number" value={Math.round(element.y)} onChange={e => updateElement(element.id, { y: Number(e.target.value) })} />
                </div>
              </AccordionItem>
              <AccordionItem value="size" title="Size">
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Width" type="number" value={Math.round(element.width)} onChange={e => updateElement(element.id, { width: Number(e.target.value) })} />
                  <Input label="Height" type="number" value={Math.round(element.height)} onChange={e => updateElement(element.id, { height: Number(e.target.value) })} />
                </div>
              </AccordionItem>
              {isTextElement && (
                <AccordionItem value="text" title="Text Content">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-text-secondary mb-2 block font-medium">Edit Text</label>
                      <textarea
                        value={(element.content?.text as string) || ''}
                        onChange={e => updateContent('text', e.target.value)}
                        className="w-full px-3 py-3 bg-background-secondary border border-border rounded-md text-base resize-vertical min-h-[100px] focus:border-accent focus:ring-1 focus:ring-accent/20"
                        placeholder="Type your text here..."
                      />
                    </div>
                    <div>
                      <label className="text-sm text-text-secondary mb-2 block">Font Family</label>
                      <FontSelector
                        value={(element.content?.fontFamily as string) || 'Inter'}
                        onChange={font => updateContent('fontFamily', font)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        label="Size (px)"
                        type="number"
                        value={(element.content?.fontSize as number) || 16}
                        onChange={e => updateContent('fontSize', Number(e.target.value))}
                        min={8}
                        max={200}
                      />
                      <Input
                        label="Weight"
                        type="number"
                        value={(element.content?.fontWeight as number) || 400}
                        onChange={e => updateContent('fontWeight', Number(e.target.value))}
                        step={100}
                        min={100}
                        max={900}
                      />
                    </div>
                    <ColorPicker
                      label="Color"
                      value={(element.content?.color as string) || '#000000'}
                      onChange={color => updateContent('color', color)}
                    />
                    <div>
                      <label className="text-sm text-text-secondary mb-2 block">Alignment</label>
                      <div className="flex gap-2">
                        {['left', 'center', 'right'].map(align => (
                          <button
                            key={align}
                            className={`flex-1 py-2.5 px-3 rounded-md text-sm capitalize transition-colors font-medium ${
                              (element.content?.textAlign || 'left') === align
                                ? 'bg-accent text-background-secondary'
                                : 'bg-background-tertiary text-text-secondary hover:bg-border'
                            }`}
                            onClick={() => updateContent('textAlign', align)}
                          >
                            {align}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </AccordionItem>
              )}
              {isShapeElement && (
                <AccordionItem value="fill" title="Fill & Stroke">
                  <div className="space-y-4">
                    <ColorPicker
                      label="Fill"
                      value={(element.content?.fill as string) || '#3B82F6'}
                      onChange={color => updateContent('fill', color)}
                    />
                    <ColorPicker
                      label="Stroke"
                      value={(element.content?.stroke as string) || '#1E40AF'}
                      onChange={color => updateContent('stroke', color)}
                    />
                    <Input
                      label="Stroke Width"
                      type="number"
                      value={(element.content?.strokeWidth as number) || 0}
                      onChange={e => updateContent('strokeWidth', Number(e.target.value))}
                      min={0}
                    />
                    <Input
                      label="Border Radius"
                      type="number"
                      value={(element.content?.borderRadius as number) || 0}
                      onChange={e => updateContent('borderRadius', Number(e.target.value))}
                      min={0}
                    />
                    <Input
                      label="Opacity %"
                      type="number"
                      value={(element.content?.opacity as number) ?? 100}
                      onChange={e => updateContent('opacity', Number(e.target.value))}
                      min={0}
                      max={100}
                    />
                  </div>
                </AccordionItem>
              )}
              {isSectionElement && (
                <AccordionItem value="background" title="Background">
                  <div className="space-y-4">
                    <ColorPicker
                      label="Color"
                      value={(element.content?.backgroundColor as string) || activeTheme.colors.background}
                      onChange={color => updateContent('backgroundColor', color)}
                    />
                  </div>
                </AccordionItem>
              )}
              <AccordionItem value="customColor" title="Custom Color">
                <ManualColorPicker onColorSelect={handleManualColorSelect} />
              </AccordionItem>
            </>
          )}
          <AccordionItem value="themeColors" title="Theme Colors">
            <div className="grid grid-cols-5 gap-2">
              {Object.entries(activeTheme.colors).map(([key, color]) => (
                <button
                  key={key}
                  className="w-10 h-10 rounded-lg border border-border hover:scale-110 transition-transform shadow-subtle"
                  style={{ backgroundColor: color }}
                  title={key}
                  onClick={() => {
                    if (single) {
                      if (isTextElement) updateContent('color', color)
                      else if (isShapeElement) updateContent('fill', color)
                      else if (isSectionElement) updateContent('backgroundColor', color)
                    }
                  }}
                />
              ))}
            </div>
            <p className="text-xs text-text-tertiary mt-3">Click a color to apply it to the selected element</p>
          </AccordionItem>
        </Accordion.Root>
      </div>
    </div>
  )
}
export { ElementProperties }