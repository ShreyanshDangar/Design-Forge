import { useRef, useState, useCallback, useEffect } from 'react'
import { useCanvasStore, CanvasElement as CanvasElementType } from '../../stores/canvasStore'
import { useColorStore } from '../../stores/colorStore'
import { useTypographyStore } from '../../stores/typographyStore'
import { SectionRenderer } from '../sections/SectionRenderer'

interface CanvasElementProps { element: CanvasElementType; isSelected: boolean }
type ResizeHandle = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w'
const CanvasElement = ({ element, isSelected }: CanvasElementProps) => {
  const elementRef = useRef<HTMLDivElement>(null)
  const { selectElement, updateElement, pushHistory, zoom } = useCanvasStore()
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState<ResizeHandle | null>(null)
  const [dragStart, setDragStart] = useState<{ x: number; y: number; elX: number; elY: number; elW: number; elH: number } | null>(null)
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (element.locked) return
    e.stopPropagation(); e.preventDefault()
    selectElement(element.id, e.shiftKey)
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY, elX: element.x, elY: element.y, elW: element.width, elH: element.height })
    pushHistory()
  }, [element.id, element.locked, element.x, element.y, element.width, element.height, selectElement, pushHistory])
  const handleResizeStart = useCallback((e: React.MouseEvent, handle: ResizeHandle) => {
    if (element.locked) return
    e.stopPropagation(); e.preventDefault()
    setIsResizing(handle)
    setDragStart({ x: e.clientX, y: e.clientY, elX: element.x, elY: element.y, elW: element.width, elH: element.height })
    pushHistory()
  }, [element.locked, element.x, element.y, element.width, element.height, pushHistory])
  useEffect(() => {
    if (!isDragging && !isResizing) return
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStart) return
      const currentZoom = zoom || 1
      const dx = (e.clientX - dragStart.x) / currentZoom
      const dy = (e.clientY - dragStart.y) / currentZoom
      if (isDragging) updateElement(element.id, { x: Math.max(0, dragStart.elX + dx), y: Math.max(0, dragStart.elY + dy) })
      else if (isResizing) {
        let newX = dragStart.elX, newY = dragStart.elY, newW = dragStart.elW, newH = dragStart.elH
        if (isResizing.includes('e')) newW = Math.max(100, dragStart.elW + dx)
        if (isResizing.includes('w')) { newW = Math.max(100, dragStart.elW - dx); newX = dragStart.elX + (dragStart.elW - newW) }
        if (isResizing.includes('s')) newH = Math.max(50, dragStart.elH + dy)
        if (isResizing.includes('n')) { newH = Math.max(50, dragStart.elH - dy); newY = dragStart.elY + (dragStart.elH - newH) }
        updateElement(element.id, { x: newX, y: newY, width: newW, height: newH })
      }
    }
    const handleMouseUp = () => { setIsDragging(false); setIsResizing(null); setDragStart(null) }
    window.addEventListener('mousemove', handleMouseMove); window.addEventListener('mouseup', handleMouseUp)
    return () => { window.removeEventListener('mousemove', handleMouseMove); window.removeEventListener('mouseup', handleMouseUp) }
  }, [isDragging, isResizing, dragStart, element.id, updateElement, zoom])
  const handles: ResizeHandle[] = ['nw','n','ne','e','se','s','sw','w']
  const handlePositions: Record<ResizeHandle, string> = {
    nw:'top-0 left-0 -translate-x-1/2 -translate-y-1/2 cursor-nwse-resize',
    n:'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-ns-resize',
    ne:'top-0 right-0 translate-x-1/2 -translate-y-1/2 cursor-nesw-resize',
    e:'top-1/2 right-0 translate-x-1/2 -translate-y-1/2 cursor-ew-resize',
    se:'bottom-0 right-0 translate-x-1/2 translate-y-1/2 cursor-nwse-resize',
    s:'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 cursor-ns-resize',
    sw:'bottom-0 left-0 -translate-x-1/2 translate-y-1/2 cursor-nesw-resize',
    w:'top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize'
  }
  return (
    <div ref={elementRef} className={`absolute ${element.locked ? 'cursor-not-allowed' : 'cursor-move'} ${isSelected ? 'ring-2 ring-accent' : ''}`} style={{ left: element.x, top: element.y, width: element.width, height: element.height }} onMouseDown={handleMouseDown}>
      <SectionRenderer element={element} />
      {isSelected && !element.locked && handles.map(handle => (
        <div key={handle} className={`absolute w-2.5 h-2.5 bg-accent border-2 border-background-secondary rounded-sm ${handlePositions[handle]}`} onMouseDown={(e) => handleResizeStart(e, handle)} />
      ))}
    </div>
  )
}
export { CanvasElement }