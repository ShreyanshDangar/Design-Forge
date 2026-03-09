import { Layout, Palette, Sliders, Layers } from 'lucide-react'

interface MobileNavBarProps {
  onLeftPanel: () => void
  onRightPanel: () => void
  leftOpen: boolean
  rightOpen: boolean
}
const MobileNavBar = ({ onLeftPanel, onRightPanel, leftOpen, rightOpen }: MobileNavBarProps) => {
  return (
    <div className="flex items-center justify-around py-2 px-4 bg-background-secondary border-t-2 border-border safe-area-bottom">
      <button onClick={onLeftPanel} className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${leftOpen ? 'bg-accent text-background-primary' : 'text-text-secondary hover:bg-background-tertiary'}`}>
        <Layout size={22} />
        <span className="text-xs font-medium">Sections</span>
      </button>
      <button onClick={onLeftPanel} className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${leftOpen ? 'bg-accent text-background-primary' : 'text-text-secondary hover:bg-background-tertiary'}`}>
        <Palette size={22} />
        <span className="text-xs font-medium">Colors</span>
      </button>
      <button onClick={onRightPanel} className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${rightOpen ? 'bg-accent text-background-primary' : 'text-text-secondary hover:bg-background-tertiary'}`}>
        <Sliders size={22} />
        <span className="text-xs font-medium">Properties</span>
      </button>
      <button onClick={onRightPanel} className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${rightOpen ? 'bg-accent text-background-primary' : 'text-text-secondary hover:bg-background-tertiary'}`}>
        <Layers size={22} />
        <span className="text-xs font-medium">Layers</span>
      </button>
    </div>
  )
}
export { MobileNavBar }