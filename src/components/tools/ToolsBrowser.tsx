import { useState, useRef } from 'react'
import { useCanvasStore } from '../../stores/canvasStore'
import { useColorStore } from '../../stores/colorStore'
import { Button } from '../ui'
import { Square, Circle, Triangle, Star, Type, Hexagon, Pentagon, Minus, ChevronDown, ChevronRight, Palette, Plus } from 'lucide-react'

interface ToolsBrowserProps {
  searchQuery: string
}
const generateId = () => Math.random().toString(36).substring(2, 15)
interface ShapeToolProps {
  icon: React.ComponentType<{ size: number; className?: string }>
  name: string
  shapeType: string
  onClick: () => void
}
const ShapeTool = ({ icon: Icon, name, shapeType, onClick }: ShapeToolProps) => (
  <button
    className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-background-tertiary hover:bg-border transition-colors cursor-pointer group"
    onClick={onClick}
    title={`Add ${name}`}
  >
    <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-background-secondary group-hover:bg-accent/10 transition-colors">
      <Icon size={28} className="text-text-secondary group-hover:text-accent transition-colors" />
    </div>
    <span className="text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors">{name}</span>
  </button>
)
const ToolsBrowser = ({ searchQuery }: ToolsBrowserProps) => {
  const { addElement, pages, currentPageId, zoom, panX, panY } = useCanvasStore()
  const { activeTheme } = useColorStore()
  const [shapesExpanded, setShapesExpanded] = useState(true)
  const [textExpanded, setTextExpanded] = useState(true)
  const [canvasExpanded, setCanvasExpanded] = useState(true)
  const [selectedColor, setSelectedColor] = useState(activeTheme.colors.primary)
  const colorInputRef = useRef<HTMLInputElement>(null)
  const currentPage = pages.find(p => p.id === currentPageId)
  const elements = currentPage?.elements || []
  const getNextPosition = () => {
    if (elements.length === 0) return { x: 100, y: 100 }
    const lastEl = elements[elements.length - 1]
    return { x: lastEl.x + 30, y: lastEl.y + lastEl.height + 30 }
  }
  const addShape = (shapeType: string, defaultWidth: number, defaultHeight: number) => {
    const pos = getNextPosition()
    addElement({
      id: generateId(),
      type: 'shape',
      x: pos.x,
      y: pos.y,
      width: defaultWidth,
      height: defaultHeight,
      locked: false,
      visible: true,
      content: {
        shapeType,
        fill: selectedColor,
        stroke: activeTheme.colors.border,
        strokeWidth: 0,
        borderRadius: shapeType === 'rectangle' ? 8 : 0,
        opacity: 100
      }
    })
  }
  const addText = (preset: 'heading' | 'subheading' | 'body' | 'caption') => {
    const pos = getNextPosition()
    const presets = {
      heading: { text: 'Heading', fontSize: 48, fontWeight: 700, width: 400, height: 60 },
      subheading: { text: 'Subheading', fontSize: 32, fontWeight: 600, width: 350, height: 45 },
      body: { text: 'Body text. Click to edit this text and customize it however you want.', fontSize: 16, fontWeight: 400, width: 400, height: 80 },
      caption: { text: 'Caption text', fontSize: 12, fontWeight: 400, width: 200, height: 24 }
    }
    const p = presets[preset]
    addElement({
      id: generateId(),
      type: 'text',
      x: pos.x,
      y: pos.y,
      width: p.width,
      height: p.height,
      locked: false,
      visible: true,
      content: {
        text: p.text,
        fontFamily: preset === 'heading' || preset === 'subheading' ? 'Playfair Display' : 'Inter',
        fontSize: p.fontSize,
        fontWeight: p.fontWeight,
        color: activeTheme.colors.textPrimary,
        textAlign: 'left'
      }
    })
  }
  const shapes = [
    { icon: Square, name: 'Rectangle', shapeType: 'rectangle', width: 200, height: 150 },
    { icon: Circle, name: 'Circle', shapeType: 'circle', width: 150, height: 150 },
    { icon: Triangle, name: 'Triangle', shapeType: 'triangle', width: 150, height: 130 },
    { icon: Star, name: 'Star', shapeType: 'star', width: 150, height: 150 },
    { icon: Hexagon, name: 'Hexagon', shapeType: 'hexagon', width: 150, height: 130 },
    { icon: Minus, name: 'Line', shapeType: 'line', width: 200, height: 4 }
  ]
  const textPresets = [
    { preset: 'heading' as const, name: 'Heading', description: 'Large title text' },
    { preset: 'subheading' as const, name: 'Subheading', description: 'Secondary title' },
    { preset: 'body' as const, name: 'Body Text', description: 'Paragraph text' },
    { preset: 'caption' as const, name: 'Caption', description: 'Small label text' }
  ]
  const filteredShapes = shapes.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const filteredText = textPresets.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description.toLowerCase().includes(searchQuery.toLowerCase())
  )
  return (
    <div className="p-4">
      <div className="mb-6 bg-background-tertiary rounded-lg p-4">
        <div className="flex items-center gap-3 mb-3">
          <Palette size={20} className="text-accent" />
          <span className="text-sm font-semibold text-text-primary">Default Color</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="w-12 h-12 rounded-lg border-2 border-border cursor-pointer shadow-subtle hover:border-accent transition-colors"
            style={{ backgroundColor: selectedColor }}
            onClick={() => colorInputRef.current?.click()}
          >
            <input
              ref={colorInputRef}
              type="color"
              value={selectedColor}
              onChange={e => setSelectedColor(e.target.value.toUpperCase())}
              className="absolute w-0 h-0 opacity-0"
            />
          </button>
          <div className="flex flex-wrap gap-2 flex-1">
            {Object.entries(activeTheme.colors).slice(0, 6).map(([key, color]) => (
              <button
                key={key}
                className={`w-8 h-8 rounded-md border transition-all ${selectedColor === color ? 'border-accent scale-110' : 'border-border hover:border-accent'}`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
                title={key}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="mb-6">
        <button
          onClick={() => setShapesExpanded(!shapesExpanded)}
          className="w-full flex items-center gap-2 py-3 px-3 rounded-lg bg-background-tertiary hover:bg-border transition-colors mb-3"
        >
          <div className="w-8 h-8 flex items-center justify-center rounded bg-accent/10">
            {shapesExpanded ? <ChevronDown size={20} className="text-accent" /> : <ChevronRight size={20} className="text-accent" />}
          </div>
          <Square size={20} className="text-accent" />
          <h4 className="text-base font-semibold text-text-primary flex-1 text-left">Shapes</h4>
          <span className="text-sm text-text-tertiary bg-background-secondary px-2 py-0.5 rounded">{shapes.length}</span>
        </button>
        {shapesExpanded && (
          <div className="grid grid-cols-2 gap-3">
            {filteredShapes.map(shape => (
              <ShapeTool
                key={shape.shapeType}
                icon={shape.icon}
                name={shape.name}
                shapeType={shape.shapeType}
                onClick={() => addShape(shape.shapeType, shape.width, shape.height)}
              />
            ))}
          </div>
        )}
      </div>
      <div className="mb-6">
        <button
          onClick={() => setTextExpanded(!textExpanded)}
          className="w-full flex items-center gap-2 py-3 px-3 rounded-lg bg-background-tertiary hover:bg-border transition-colors mb-3"
        >
          <div className="w-8 h-8 flex items-center justify-center rounded bg-accent/10">
            {textExpanded ? <ChevronDown size={20} className="text-accent" /> : <ChevronRight size={20} className="text-accent" />}
          </div>
          <Type size={20} className="text-accent" />
          <h4 className="text-base font-semibold text-text-primary flex-1 text-left">Text</h4>
          <span className="text-sm text-text-tertiary bg-background-secondary px-2 py-0.5 rounded">{textPresets.length}</span>
        </button>
        {textExpanded && (
          <div className="space-y-2">
            {filteredText.map(textItem => (
              <button
                key={textItem.preset}
                className="w-full p-4 rounded-lg bg-background-tertiary hover:bg-border transition-colors text-left group"
                onClick={() => addText(textItem.preset)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-base font-medium text-text-primary group-hover:text-accent transition-colors block">{textItem.name}</span>
                    <span className="text-sm text-text-tertiary">{textItem.description}</span>
                  </div>
                  <Plus size={20} className="text-text-tertiary group-hover:text-accent transition-colors" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="bg-background-tertiary rounded-lg p-4">
        <h4 className="text-sm font-semibold text-text-primary mb-2">Quick Tips</h4>
        <ul className="text-xs text-text-tertiary space-y-1">
          <li>Click any shape or text to add it to the canvas</li>
          <li>Select elements and use the right panel to customize</li>
          <li>Drag elements to reposition them</li>
          <li>Use corners to resize elements</li>
        </ul>
      </div>
    </div>
  )
}
export { ToolsBrowser }