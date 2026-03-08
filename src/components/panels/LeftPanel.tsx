import { useState } from 'react'
import { useUIStore } from '../../stores/uiStore'
import { Panel } from '../ui'
import { Search, Layout, Type, Palette, Shapes, X, GripHorizontal } from 'lucide-react'
import { SectionBrowser } from '../sections/SectionBrowser'
import { FontBrowser } from '../typography/FontBrowser'
import { ThemeBrowser } from '../colors/ThemeBrowser'
import { ToolsBrowser } from '../tools/ToolsBrowser'

type Tab = 'tools' | 'sections' | 'fonts' | 'colors'
const tabs: { id: Tab; label: string; icon: typeof Layout }[] = [
  { id: 'tools', label: 'Tools', icon: Shapes },
  { id: 'sections', label: 'Sections', icon: Layout },
  { id: 'fonts', label: 'Fonts', icon: Type },
  { id: 'colors', label: 'Colors', icon: Palette }
]
interface LeftPanelProps {
  isMobile?: boolean
  isTablet?: boolean
}
const LeftPanel = ({ isMobile = false, isTablet = false }: LeftPanelProps) => {
  const { leftPanelOpen, leftPanelWidth, setLeftPanelOpen } = useUIStore()
  const [activeTab, setActiveTab] = useState<Tab>('tools')
  const [searchQuery, setSearchQuery] = useState('')
  const isSmallScreen = isMobile || isTablet
  return (
    <Panel side="left" isOpen={leftPanelOpen} width={isSmallScreen ? Math.min(leftPanelWidth, window.innerWidth - 40) : leftPanelWidth} isMobile={isMobile} isTablet={isTablet}>
      <div className="h-full flex flex-col border-r-2 border-border">
        {isSmallScreen && (
          <div className="flex flex-col items-center pt-2 pb-1 border-b border-border bg-background-tertiary/50">
            <div className="w-10 h-1 rounded-full bg-border mb-2" />
            <div className="flex items-center justify-between w-full px-3">
              <span className="font-semibold text-text-primary">Tools & Sections</span>
              <button onClick={() => setLeftPanelOpen(false)} className="p-2 rounded-lg hover:bg-background-tertiary text-text-secondary hover:text-text-primary transition-colors">
                <X size={20} />
              </button>
            </div>
          </div>
        )}
        <div className="p-2 sm:p-3 bg-background-tertiary/30 border-b-2 border-border">
          <div className="grid grid-cols-4 gap-1.5 p-1.5 bg-background-secondary rounded-xl border border-border shadow-subtle">
            {tabs.map(tab => {
              const isActive = activeTab === tab.id
              return (
                <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSearchQuery('') }} className={`flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-lg transition-all ${isActive ? 'bg-accent text-background-primary shadow-md' : 'text-text-secondary hover:bg-background-tertiary hover:text-text-primary'}`}>
                  <tab.icon size={20} strokeWidth={isActive ? 2 : 1.5} />
                  <span className={`text-xs font-semibold ${isActive ? '' : 'font-medium'}`}>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
        <div className="p-3 border-b border-border bg-background-secondary/50">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
            <input type="text" placeholder={`Search ${tabs.find(t => t.id === activeTab)?.label.toLowerCase() || ''}...`} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onFocus={e => e.target.select()} className="w-full h-11 pl-10 pr-4 bg-background-primary border-2 border-border rounded-lg text-sm text-text-primary placeholder:text-text-tertiary transition-colors focus:border-accent focus:outline-none" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'tools' && <ToolsBrowser searchQuery={searchQuery} />}
          {activeTab === 'sections' && <SectionBrowser searchQuery={searchQuery} />}
          {activeTab === 'fonts' && <FontBrowser searchQuery={searchQuery} />}
          {activeTab === 'colors' && <ThemeBrowser searchQuery={searchQuery} />}
        </div>
      </div>
    </Panel>
  )
}
export { LeftPanel }