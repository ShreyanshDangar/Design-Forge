import { useEffect, useMemo, useState, useCallback } from 'react'
import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core'
import { useUIStore } from './stores/uiStore'
import { useCanvasStore } from './stores/canvasStore'
import { TooltipProvider } from './components/ui'
import { TopBar } from './components/panels/TopBar'
import { LeftPanel } from './components/panels/LeftPanel'
import { RightPanel } from './components/panels/RightPanel'
import { Canvas } from './components/canvas/Canvas'
import { PageManager } from './components/canvas/PageManager'
import { CommandPalette } from './components/ui/CommandPalette'
import { ExportModal } from './components/export/ExportModal'
import { MobileNavBar } from './components/panels/MobileNavBar'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'

const App = () => {
  const { theme, leftPanelOpen, rightPanelOpen, setLeftPanelOpen, setRightPanelOpen } = useUIStore()
  const { addElement, pages, currentPageId } = useCanvasStore()
  useKeyboardShortcuts()
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth
      setIsMobile(width < 768)
      setIsTablet(width >= 768 && width < 1024)
    }
    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])
  const handleOverlayClick = useCallback(() => {
    if (isMobile || isTablet) {
      setLeftPanelOpen(false)
      setRightPanelOpen(false)
    }
  }, [isMobile, isTablet, setLeftPanelOpen, setRightPanelOpen])
  const elements = useMemo(() => {
    const currentPage = pages.find(p => p.id === currentPageId)
    return currentPage?.elements || []
  }, [pages, currentPageId])
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over?.id === 'canvas' && active.data.current?.type === 'section') {
      const section = active.data.current.section
      const lastElement = elements[elements.length - 1]
      const y = lastElement ? lastElement.y + lastElement.height + 32 : 0
      addElement({
        id: Math.random().toString(36).substring(2, 15),
        type: 'section',
        sectionType: section.name,
        x: 0,
        y,
        width: section.width,
        height: section.height,
        locked: false,
        visible: true,
        content: { templateId: section.id },
      })
    }
  }
  const showOverlay = (isMobile || isTablet) && (leftPanelOpen || rightPanelOpen)
  const isSmallScreen = isMobile || isTablet
  return (
    <TooltipProvider>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="h-screen w-screen flex flex-col bg-background-primary overflow-hidden">
          <TopBar isMobile={isMobile} isTablet={isTablet} />
          <PageManager />
          <div className={`flex-1 flex overflow-hidden relative ${isSmallScreen ? 'flex-col' : ''}`}>
            {!isSmallScreen && <LeftPanel isMobile={false} />}
            <Canvas />
            {!isSmallScreen && <RightPanel isMobile={false} />}
            {isSmallScreen && (
              <>
                <LeftPanel isMobile={true} isTablet={isTablet} />
                <RightPanel isMobile={true} isTablet={isTablet} />
              </>
            )}
            <div className={`mobile-overlay ${showOverlay ? 'active' : ''}`} onClick={handleOverlayClick} />
          </div>
          {isSmallScreen && <MobileNavBar onLeftPanel={() => setLeftPanelOpen(!leftPanelOpen)} onRightPanel={() => setRightPanelOpen(!rightPanelOpen)} leftOpen={leftPanelOpen} rightOpen={rightPanelOpen} />}
        </div>
        <CommandPalette />
        <ExportModal />
      </DndContext>
    </TooltipProvider>
  )
}
export default App