import { useUIStore, deviceWidths, DevicePreview } from '../../stores/uiStore'
import { useCanvasStore } from '../../stores/canvasStore'
import { Button, Tooltip, Dropdown, DropdownItem, DropdownSeparator, DropdownCheckboxItem } from '../ui'
import { Smartphone, Tablet, Laptop, Monitor, MonitorUp, Sun, Moon, Download, Settings, Minus, Plus, PanelLeftClose, PanelRightClose, Undo2, Redo2, Command, ChevronDown, Menu } from 'lucide-react'

interface TopBarProps {
  isMobile?: boolean
  isTablet?: boolean
}
const Logo = ({ isMobile }: { isMobile?: boolean }) => (
  <div className="flex items-center gap-2">
    <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
      <span className="text-background-secondary font-bold text-base">D</span>
    </div>
    {!isMobile && <span className="font-semibold text-text-primary text-lg">DesignForge</span>}
  </div>
)
const DeviceButton = ({ device, icon: Icon, label }: { device: DevicePreview; icon: typeof Smartphone; label: string }) => {
  const { devicePreview, setDevicePreview } = useUIStore()
  return (
    <Tooltip content={`${label} (${deviceWidths[device]}px)`}>
      <Button variant={devicePreview === device ? 'secondary' : 'ghost'} size="sm" onClick={() => setDevicePreview(device)}>
        <Icon size={20} />
      </Button>
    </Tooltip>
  )
}
const ZoomControls = ({ compact = false }: { compact?: boolean }) => {
  const { zoom, setZoom } = useCanvasStore()
  const zoomPercent = Math.round(zoom * 100)
  const zoomPresets = [25, 50, 75, 100, 150, 200, 300, 400]
  return (
    <div className="flex items-center gap-1">
      {!compact && (
        <Tooltip content="Zoom out">
          <Button variant="ghost" size="sm" onClick={() => setZoom(zoom - 0.1)}>
            <Minus size={18} />
          </Button>
        </Tooltip>
      )}
      <Dropdown
        trigger={
          <Button variant="ghost" size="sm" className={`${compact ? 'min-w-[50px]' : 'min-w-[70px]'} gap-1 text-base`}>
            {zoomPercent}%
            <ChevronDown size={14} />
          </Button>
        }
      >
        {zoomPresets.map(preset => (
          <DropdownItem key={preset} onSelect={() => setZoom(preset / 100)}>
            {preset}%
          </DropdownItem>
        ))}
        <DropdownSeparator />
        <DropdownItem onSelect={() => setZoom(1)}>Zoom to 100%</DropdownItem>
      </Dropdown>
      {!compact && (
        <Tooltip content="Zoom in">
          <Button variant="ghost" size="sm" onClick={() => setZoom(zoom + 0.1)}>
            <Plus size={18} />
          </Button>
        </Tooltip>
      )}
    </div>
  )
}
const TopBar = ({ isMobile = false, isTablet = false }: TopBarProps) => {
  const {
    theme,
    toggleTheme,
    leftPanelOpen,
    setLeftPanelOpen,
    rightPanelOpen,
    setRightPanelOpen,
    projectName,
    setProjectName,
    showGrid,
    setShowGrid,
    setCommandPaletteOpen,
    setExportModalOpen
  } = useUIStore()
  const { undo, redo, historyIndex, history } = useCanvasStore()
  const canUndo = historyIndex > 0
  const canRedo = historyIndex < history.length - 1
  if (isMobile) {
    return (
      <header className="h-14 bg-background-secondary border-b-2 border-border shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex items-center px-2 sm:px-4 gap-2 flex-shrink-0 z-10">
        <Button variant="ghost" size="sm" onClick={() => setLeftPanelOpen(!leftPanelOpen)}>
          <Menu size={20} />
        </Button>
        <Logo isMobile={true} />
        <div className="flex-1 min-w-0">
          <input
            type="text"
            value={projectName}
            onChange={e => setProjectName(e.target.value)}
            onFocus={e => e.target.select()}
            className="bg-transparent text-text-primary font-medium text-sm border-none outline-none w-full max-w-[100px] focus:bg-background-tertiary rounded px-2 py-1.5 transition-colors truncate"
            placeholder="Untitled"
          />
        </div>
        <ZoomControls compact={true} />
        <Tooltip content={theme === 'light' ? 'Dark mode' : 'Light mode'}>
          <Button variant="ghost" size="sm" onClick={toggleTheme}>
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </Button>
        </Tooltip>
        <Button variant="ghost" size="sm" onClick={() => setRightPanelOpen(!rightPanelOpen)}>
          <PanelRightClose size={20} className={rightPanelOpen ? '' : 'rotate-180'} />
        </Button>
        <Dropdown
          trigger={
            <Button variant="ghost" size="sm">
              <Settings size={20} />
            </Button>
          }
        >
          <DropdownItem onSelect={undo} disabled={!canUndo}>
            <Undo2 size={16} className="mr-2" /> Undo
          </DropdownItem>
          <DropdownItem onSelect={redo} disabled={!canRedo}>
            <Redo2 size={16} className="mr-2" /> Redo
          </DropdownItem>
          <DropdownSeparator />
          <DropdownCheckboxItem checked={showGrid} onCheckedChange={setShowGrid}>
            Show grid
          </DropdownCheckboxItem>
          <DropdownSeparator />
          <DropdownItem onSelect={() => setExportModalOpen(true)}>
            <Download size={16} className="mr-2" /> Export
          </DropdownItem>
        </Dropdown>
      </header>
    )
  }
  return (
    <header className="h-14 bg-background-secondary border-b-2 border-border shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex items-center px-4 gap-3 flex-shrink-0 z-10">
      <Logo />
      <div className="w-px h-6 bg-border" />
      <Tooltip content="Toggle left panel">
        <Button variant="ghost" size="sm" onClick={() => setLeftPanelOpen(!leftPanelOpen)}>
          <PanelLeftClose size={20} className={leftPanelOpen ? '' : 'rotate-180'} />
        </Button>
      </Tooltip>
      <input
        type="text"
        value={projectName}
        onChange={e => setProjectName(e.target.value)}
        onFocus={e => e.target.select()}
        className="bg-transparent text-text-primary font-medium text-base border-none outline-none w-36 focus:bg-background-tertiary rounded px-2 py-1.5 transition-colors"
        placeholder="Untitled"
      />
      <div className="flex-1" />
      <Tooltip content="Undo">
        <Button variant="ghost" size="sm" onClick={undo} disabled={!canUndo}>
          <Undo2 size={20} />
        </Button>
      </Tooltip>
      <Tooltip content="Redo">
        <Button variant="ghost" size="sm" onClick={redo} disabled={!canRedo}>
          <Redo2 size={20} />
        </Button>
      </Tooltip>
      <div className="w-px h-6 bg-border hidden lg:block" />
      <div className="hidden lg:flex items-center gap-1">
        <DeviceButton device="mobile" icon={Smartphone} label="Mobile" />
        <DeviceButton device="tablet" icon={Tablet} label="Tablet" />
        <DeviceButton device="laptop" icon={Laptop} label="Laptop" />
        <DeviceButton device="desktop" icon={Monitor} label="Desktop" />
        <DeviceButton device="wide" icon={MonitorUp} label="Wide" />
      </div>
      <div className="w-px h-6 bg-border" />
      <ZoomControls />
      <div className="w-px h-6 bg-border" />
      <Dropdown
        trigger={
          <Button variant="ghost" size="sm">
            <Settings size={20} />
          </Button>
        }
      >
        <DropdownCheckboxItem checked={showGrid} onCheckedChange={setShowGrid}>
          Show grid
        </DropdownCheckboxItem>
        <DropdownSeparator />
        <div className="lg:hidden">
          <DropdownItem onSelect={() => useUIStore.getState().setDevicePreview('mobile')}>
            <Smartphone size={16} className="mr-2" /> Mobile Preview
          </DropdownItem>
          <DropdownItem onSelect={() => useUIStore.getState().setDevicePreview('tablet')}>
            <Tablet size={16} className="mr-2" /> Tablet Preview
          </DropdownItem>
          <DropdownItem onSelect={() => useUIStore.getState().setDevicePreview('desktop')}>
            <Monitor size={16} className="mr-2" /> Desktop Preview
          </DropdownItem>
          <DropdownSeparator />
        </div>
      </Dropdown>
      <Tooltip content="Command palette (Cmd+K)">
        <Button variant="ghost" size="sm" onClick={() => setCommandPaletteOpen(true)}>
          <Command size={20} />
        </Button>
      </Tooltip>
      <Tooltip content={theme === 'light' ? 'Dark mode' : 'Light mode'}>
        <Button variant="ghost" size="sm" onClick={toggleTheme}>
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </Button>
      </Tooltip>
      <Tooltip content="Toggle right panel">
        <Button variant="ghost" size="sm" onClick={() => setRightPanelOpen(!rightPanelOpen)}>
          <PanelRightClose size={20} className={rightPanelOpen ? '' : 'rotate-180'} />
        </Button>
      </Tooltip>
      <Button onClick={() => setExportModalOpen(true)} className="gap-2">
        <Download size={18} />
        <span className="hidden sm:inline">Export</span>
      </Button>
    </header>
  )
}
export { TopBar }