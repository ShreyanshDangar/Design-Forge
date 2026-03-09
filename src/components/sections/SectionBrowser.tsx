import { useState, useMemo } from 'react'
import { sectionTemplates, sectionCategories, SectionTemplate } from '../../data/sections'
import { useCanvasStore } from '../../stores/canvasStore'
import { useColorStore } from '../../stores/colorStore'
import { useDraggable } from '@dnd-kit/core'
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'

interface SectionBrowserProps { searchQuery: string }
interface SectionCardProps { section: SectionTemplate }
const ITEMS_PER_PAGE = 8
const SectionCard = ({ section }: SectionCardProps) => {
  const { addElement, pages, currentPageId } = useCanvasStore()
  const { activeTheme } = useColorStore()
  const currentPage = pages.find(p => p.id === currentPageId)
  const elements = currentPage?.elements || []
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: section.id, data: { type: 'section', section } })
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, opacity: isDragging ? 0.5 : 1 } : undefined
  const handleDoubleClick = () => {
    const lastElement = elements[elements.length - 1]
    const y = lastElement ? lastElement.y + lastElement.height + 32 : 0
    addElement({ id: Math.random().toString(36).substring(2, 15), type: 'section', sectionType: section.name, x: 0, y, width: section.width, height: section.height, locked: false, visible: true, content: { templateId: section.id } })
  }
  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="group cursor-grab active:cursor-grabbing" onDoubleClick={handleDoubleClick}>
      <div className="rounded-lg border border-border bg-background-tertiary overflow-hidden transition-all hover:border-text-tertiary hover:shadow-elevated">
        <div className="h-24 flex items-center justify-center text-sm text-text-tertiary" style={{ backgroundColor: activeTheme.colors.background }}>
          <div className="text-center px-2">
            <div className="font-semibold text-sm text-text-secondary">{section.name}</div>
            <div className="text-xs text-text-tertiary mt-0.5 line-clamp-2">{section.preview}</div>
          </div>
        </div>
      </div>
      <p className="text-xs font-medium text-text-secondary mt-1.5 truncate text-center">{section.name}</p>
    </div>
  )
}
interface CollapsibleCategoryProps {
  category: string
  sections: SectionTemplate[]
  isExpanded: boolean
  onToggle: () => void
  currentPage: number
  onPageChange: (page: number) => void
}
const CollapsibleCategory = ({ category, sections, isExpanded, onToggle, currentPage, onPageChange }: CollapsibleCategoryProps) => {
  const totalPages = Math.ceil(sections.length / ITEMS_PER_PAGE)
  const paginatedSections = sections.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE)
  return (
    <div className="mb-4">
      <button onClick={onToggle} className="w-full flex items-center gap-2 py-2.5 px-3 rounded-lg bg-background-tertiary hover:bg-border transition-colors mb-2">
        <div className={`w-6 h-6 flex items-center justify-center rounded bg-accent/10 transition-transform duration-200 ${isExpanded ? 'rotate-0' : '-rotate-90'}`}>
          <ChevronDown size={16} className="text-accent" />
        </div>
        <h4 className="text-sm font-semibold text-text-primary uppercase tracking-wide flex-1 text-left">{category}</h4>
        <span className="text-xs text-text-tertiary bg-background-secondary px-2 py-0.5 rounded">{sections.length}</span>
      </button>
      <div className={`overflow-hidden transition-all duration-200 ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="grid grid-cols-2 gap-2 px-1">{paginatedSections.map(section => <SectionCard key={section.id} section={section} />)}</div>
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1 mt-3 pt-2 border-t border-border-subtle">
            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 0} className="p-1.5 rounded hover:bg-background-tertiary disabled:opacity-30 disabled:cursor-not-allowed"><ChevronLeft size={16} /></button>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i} onClick={() => onPageChange(i)} className={`w-7 h-7 rounded text-xs font-medium transition-colors ${currentPage === i ? 'bg-accent text-background-primary' : 'text-text-secondary hover:bg-background-tertiary'}`}>{i + 1}</button>
              ))}
            </div>
            <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages - 1} className="p-1.5 rounded hover:bg-background-tertiary disabled:opacity-30 disabled:cursor-not-allowed"><ChevronRight size={16} /></button>
          </div>
        )}
      </div>
    </div>
  )
}
const SectionBrowser = ({ searchQuery }: SectionBrowserProps) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(() => { const i: Record<string, boolean> = {}; sectionCategories.forEach(cat => i[cat] = true); return i })
  const [categoryPages, setCategoryPages] = useState<Record<string, number>>(() => { const i: Record<string, number> = {}; sectionCategories.forEach(cat => i[cat] = 0); return i })
  const filteredSections = useMemo(() => {
    let sections = sectionTemplates
    if (activeCategory) sections = sections.filter(s => s.category === activeCategory)
    if (searchQuery) { const q = searchQuery.toLowerCase(); sections = sections.filter(s => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)) }
    return sections
  }, [activeCategory, searchQuery])
  const groupedSections = useMemo(() => {
    const groups: Record<string, SectionTemplate[]> = {}
    filteredSections.forEach(section => { if (!groups[section.category]) groups[section.category] = []; groups[section.category].push(section) })
    return groups
  }, [filteredSections])
  const toggleCategory = (category: string) => setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] }))
  const handlePageChange = (category: string, page: number) => setCategoryPages(prev => ({ ...prev, [category]: page }))
  return (
    <div className="p-3">
      <div className="grid grid-cols-3 gap-1 mb-1 p-1 bg-background-tertiary rounded-t-lg">
        <button onClick={() => setActiveCategory(null)} className={`py-2 px-2 rounded text-xs font-medium transition-colors ${activeCategory === null ? 'bg-accent text-background-primary' : 'text-text-secondary hover:bg-background-secondary'}`}>All</button>
        {sectionCategories.slice(0, 2).map(cat => <button key={cat} onClick={() => setActiveCategory(cat)} className={`py-2 px-2 rounded text-xs font-medium transition-colors ${activeCategory === cat ? 'bg-accent text-background-primary' : 'text-text-secondary hover:bg-background-secondary'}`}>{cat}</button>)}
      </div>
      <div className="grid grid-cols-3 gap-1 mb-1 p-1 bg-background-tertiary">
        {sectionCategories.slice(2, 5).map(cat => <button key={cat} onClick={() => setActiveCategory(cat)} className={`py-2 px-2 rounded text-xs font-medium transition-colors ${activeCategory === cat ? 'bg-accent text-background-primary' : 'text-text-secondary hover:bg-background-secondary'}`}>{cat}</button>)}
      </div>
      <div className="grid grid-cols-3 gap-1 mb-1 p-1 bg-background-tertiary">
        {sectionCategories.slice(5, 8).map(cat => <button key={cat} onClick={() => setActiveCategory(cat)} className={`py-2 px-2 rounded text-xs font-medium transition-colors ${activeCategory === cat ? 'bg-accent text-background-primary' : 'text-text-secondary hover:bg-background-secondary'}`}>{cat}</button>)}
      </div>
      {sectionCategories.length > 8 && (
        <div className="flex justify-center p-1 bg-background-tertiary rounded-b-lg mb-4">
          {sectionCategories.slice(8).map(cat => <button key={cat} style={{ width: '33%' }} onClick={() => setActiveCategory(cat)} className={`py-2 px-2 rounded text-xs font-medium transition-colors ${activeCategory === cat ? 'bg-accent text-background-primary' : 'text-text-secondary hover:bg-background-secondary'}`}>{cat}</button>)}
        </div>
      )}
      <div className="space-y-1">
        {Object.entries(groupedSections).map(([category, sections]) => (
          <CollapsibleCategory key={category} category={category} sections={sections} isExpanded={expandedCategories[category] ?? true} onToggle={() => toggleCategory(category)} currentPage={categoryPages[category] ?? 0} onPageChange={page => handlePageChange(category, page)} />
        ))}
      </div>
      {filteredSections.length === 0 && <div className="text-center py-12"><p className="text-sm text-text-tertiary">No sections found</p></div>}
    </div>
  )
}
export { SectionBrowser }