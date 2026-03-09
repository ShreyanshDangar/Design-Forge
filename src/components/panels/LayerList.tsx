import { useCanvasStore, CanvasElement } from '../../stores/canvasStore'
import { Button } from '../ui'
import { Eye, EyeOff, Lock, Unlock, Layout, Type, Image, GripVertical, Square, Circle, Triangle, Star } from 'lucide-react'

const iconMap: Record<string, React.ComponentType<{ size: number; className?: string }>> = {
  section: Layout,
  text: Type,
  image: Image,
  rectangle: Square,
  circle: Circle,
  triangle: Triangle,
  star: Star,
  shape: Square
}
interface LayerItemProps { element: CanvasElement; isSelected: boolean }
const LayerItem = ({ element, isSelected }: LayerItemProps) => {
  const { selectElement, toggleLock, toggleVisibility } = useCanvasStore()
  const shapeType = element.content?.shapeType as string | undefined
  const Icon = iconMap[shapeType || element.type] || Layout
  return (
    <div className={`flex items-center gap-3 px-3 py-3 cursor-pointer transition-colors ${isSelected ? 'bg-selection' : 'hover:bg-background-tertiary'}`} onClick={() => selectElement(element.id)}>
      <GripVertical size={18} className="text-text-tertiary cursor-grab" />
      <Icon size={18} className="text-text-secondary" />
      <span className="flex-1 text-sm text-text-primary truncate">{element.sectionType || (element.content?.text as string)?.substring(0, 20) || element.type}</span>
      <button
        className={`w-9 h-9 flex items-center justify-center rounded-md transition-all border ${
          element.visible
            ? 'text-text-secondary hover:text-accent hover:bg-accent/10 border-transparent hover:border-accent/30'
            : 'text-text-tertiary bg-background-tertiary border-border'
        }`}
        onClick={e => { e.stopPropagation(); toggleVisibility(element.id) }}
        title={element.visible ? 'Hide layer' : 'Show layer'}
      >
        {element.visible ? <Eye size={22} strokeWidth={1.5} /> : <EyeOff size={22} strokeWidth={1.5} />}
      </button>
      <button
        className={`w-9 h-9 flex items-center justify-center rounded-md transition-all border ${
          element.locked
            ? 'text-accent bg-accent/10 border-accent/30'
            : 'text-text-secondary hover:text-accent hover:bg-accent/10 border-transparent hover:border-accent/30'
        }`}
        onClick={e => { e.stopPropagation(); toggleLock(element.id) }}
        title={element.locked ? 'Unlock layer' : 'Lock layer'}
      >
        {element.locked ? <Lock size={22} strokeWidth={1.5} /> : <Unlock size={22} strokeWidth={1.5} />}
      </button>
    </div>
  )
}
const LayerList = () => {
  const { pages, currentPageId, selectedIds } = useCanvasStore()
  const currentPage = pages.find(p => p.id === currentPageId)
  const elements = currentPage?.elements || []
  const reversed = [...elements].reverse()
  if (elements.length === 0) return (
    <div className="p-6 text-center">
      <p className="text-sm text-text-tertiary">No elements on canvas</p>
      <p className="text-xs text-text-tertiary mt-1">Drag sections from the left panel</p>
    </div>
  )
  return (
    <div className="py-1">
      {reversed.map(element => <LayerItem key={element.id} element={element} isSelected={selectedIds.includes(element.id)} />)}
    </div>
  )
}
export { LayerList }