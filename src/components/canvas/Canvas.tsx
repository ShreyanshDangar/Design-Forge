import { useRef, useState, useCallback, useEffect, useMemo } from 'react'
import { useCanvasStore, CanvasElement } from '../../stores/canvasStore'
import { useUIStore, deviceWidths } from '../../stores/uiStore'
import { useColorStore } from '../../stores/colorStore'
import { useTypographyStore } from '../../stores/typographyStore'
import { useDroppable } from '@dnd-kit/core'
import { CanvasElement as CanvasElementComponent } from './CanvasElement'
import { SelectionBox } from './SelectionBox'

const Canvas = () => {
  const canvasRef = useRef<HTMLDivElement>(null)
  const canvasInnerRef = useRef<HTMLDivElement>(null)
  const { zoom, panX, panY, setPan, setZoom, setIsPanning, isPanning, selectedIds, clearSelection, selectElements, currentPageId, pages, canvasBackgroundColor } = useCanvasStore()
  const { showGrid, devicePreview, leftPanelOpen, rightPanelOpen, leftPanelWidth, rightPanelWidth } = useUIStore()
  const { activeTheme } = useColorStore()
  const [isSpacePressed, setIsSpacePressed] = useState(false)
  const [dragStart, setDragStart] = useState<{ x: number; y: number; panX: number; panY: number } | null>(null)
  const [marquee, setMarquee] = useState<{ startX: number; startY: number; endX: number; endY: number } | null>(null)
  const { setNodeRef, isOver } = useDroppable({ id: 'canvas' })
  const deviceWidth = deviceWidths[devicePreview]
  const currentPage = pages.find(p => p.id === currentPageId) || pages[0]
  const elements = currentPage?.elements || []
  const effectiveBackgroundColor = currentPage?.backgroundColor || canvasBackgroundColor || activeTheme.colors.background
  const getAvailableWidth = useCallback(() => {
    const leftWidth = leftPanelOpen ? leftPanelWidth : 0
    const rightWidth = rightPanelOpen ? rightPanelWidth : 0
    return window.innerWidth - leftWidth - rightWidth
  }, [leftPanelOpen, rightPanelOpen, leftPanelWidth, rightPanelWidth])
  const canvasHeight = useMemo(() => {
    const viewportHeight = window.innerHeight - 120
    if (elements.length === 0) return Math.max(viewportHeight, 800)
    const maxBottom = Math.max(...elements.map(el => el.y + el.height))
    return Math.max(viewportHeight, maxBottom + 400)
  }, [elements])
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) { e.preventDefault(); const delta = e.deltaY > 0 ? -0.1 : 0.1; setZoom(zoom + delta) }
  }, [zoom, setZoom])
  const handleCanvasBackgroundClick = useCallback((e: React.MouseEvent) => {
    const isCanvasOuter = e.target === canvasRef.current
    const isCanvasInner = e.target === canvasInnerRef.current || (e.target as HTMLElement)?.closest('[data-canvas-bg]')
    if (!isCanvasOuter && !isCanvasInner) return
    if (isSpacePressed || e.button === 1) {
      setDragStart({ x: e.clientX, y: e.clientY, panX, panY })
      setIsPanning(true)
    } else if (e.button === 0) {
      const rect = canvasRef.current!.getBoundingClientRect()
      const x = (e.clientX - rect.left - panX) / zoom
      const y = (e.clientY - rect.top - panY) / zoom
      setMarquee({ startX: x, startY: y, endX: x, endY: y })
      if (!e.shiftKey) clearSelection()
    }
  }, [isSpacePressed, panX, panY, zoom, clearSelection, setIsPanning])
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (dragStart && isPanning) { const dx = e.clientX - dragStart.x; const dy = e.clientY - dragStart.y; setPan(dragStart.panX + dx, dragStart.panY + dy) }
    else if (marquee) {
      const rect = canvasRef.current!.getBoundingClientRect()
      const x = (e.clientX - rect.left - panX) / zoom
      const y = (e.clientY - rect.top - panY) / zoom
      setMarquee({ ...marquee, endX: x, endY: y })
    }
  }, [dragStart, isPanning, marquee, panX, panY, zoom, setPan])
  const handleMouseUp = useCallback(() => {
    if (marquee) {
      const minX = Math.min(marquee.startX, marquee.endX), maxX = Math.max(marquee.startX, marquee.endX)
      const minY = Math.min(marquee.startY, marquee.endY), maxY = Math.max(marquee.startY, marquee.endY)
      const selected = elements.filter(el => el.x < maxX && el.x + el.width > minX && el.y < maxY && el.y + el.height > minY)
      if (selected.length > 0) selectElements(selected.map(el => el.id))
    }
    setDragStart(null); setIsPanning(false); setMarquee(null)
  }, [marquee, elements, selectElements, setIsPanning])
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.code === 'Space' && !e.repeat) setIsSpacePressed(true) }
    const handleKeyUp = (e: KeyboardEvent) => { if (e.code === 'Space') setIsSpacePressed(false) }
    window.addEventListener('keydown', handleKeyDown); window.addEventListener('keyup', handleKeyUp)
    return () => { window.removeEventListener('keydown', handleKeyDown); window.removeEventListener('keyup', handleKeyUp) }
  }, [])
  useEffect(() => {
    const centerCanvas = () => {
      const availableWidth = getAvailableWidth()
      const centerX = (availableWidth - deviceWidth * zoom) / 2
      if (panX === 0 && panY === 0 && elements.length === 0) {
        setPan(Math.max(0, centerX), 0)
      }
    }
    centerCanvas()
    window.addEventListener('resize', centerCanvas)
    return () => window.removeEventListener('resize', centerCanvas)
  }, [deviceWidth, zoom, getAvailableWidth])
  return (
    <div
      ref={(node) => { canvasRef.current = node; setNodeRef(node) }}
      className={`flex-1 relative overflow-auto ${showGrid ? 'canvas-dots' : ''} ${isPanning || isSpacePressed ? 'cursor-grab' : ''} ${isPanning ? 'cursor-grabbing' : ''} ${isOver ? 'ring-2 ring-accent ring-inset' : ''}`}
      style={{ backgroundColor: 'var(--canvas-bg)' }}
      onWheel={handleWheel}
      onMouseDown={handleCanvasBackgroundClick}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="origin-top-left" style={{ transform: `translate(${panX}px, ${panY}px) scale(${zoom})`, width: deviceWidth, minHeight: canvasHeight }}>
        <div
          ref={canvasInnerRef}
          data-canvas-bg="true"
          className="relative shadow-elevated overflow-visible"
          style={{ width: deviceWidth, backgroundColor: effectiveBackgroundColor, minHeight: canvasHeight }}
          onClick={(e) => {
            if (e.target === canvasInnerRef.current || (e.target as HTMLElement)?.getAttribute('data-canvas-bg')) {
              if (!e.shiftKey) clearSelection()
            }
          }}
        >
          {elements.length === 0 ? (
            <div className="flex items-center justify-center pointer-events-none" style={{ height: canvasHeight }} data-canvas-bg="true">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                  <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                </div>
                <p className="text-lg font-medium" style={{ color: activeTheme.colors.textSecondary }}>Drag a section to begin</p>
                <p className="text-sm mt-1" style={{ color: activeTheme.colors.textSecondary, opacity: 0.7 }}>Or double-click a section in the left panel</p>
                <p className="text-xs mt-3 text-text-tertiary">Drop zone is active • Canvas auto-expands</p>
              </div>
            </div>
          ) : elements.filter(el => el.visible).map(element => <CanvasElementComponent key={element.id} element={element} isSelected={selectedIds.includes(element.id)} />)}
        </div>
      </div>
      {marquee && (<div className="absolute border-2 border-accent bg-accent/10 pointer-events-none" style={{ left: panX + Math.min(marquee.startX, marquee.endX) * zoom, top: panY + Math.min(marquee.startY, marquee.endY) * zoom, width: Math.abs(marquee.endX - marquee.startX) * zoom, height: Math.abs(marquee.endY - marquee.startY) * zoom }} />)}
    </div>
  )
}
export { Canvas }