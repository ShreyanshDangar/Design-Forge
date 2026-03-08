import { useState, useRef, useEffect } from 'react'
import { useCanvasStore, Page } from '../../stores/canvasStore'
import { Plus, Copy, Edit2, ChevronLeft, ChevronRight, MoreHorizontal, FileText, Trash2, GripVertical } from 'lucide-react'
import { Button, Dropdown, DropdownItem, DropdownSeparator } from '../ui'

const MAX_PAGES = 20
interface PageTabProps {
  page: Page
  isActive: boolean
  onSelect: () => void
  onRename: (name: string) => void
  onDuplicate: () => void
  onRemove: () => void
  canRemove: boolean
  isHome: boolean
  onDragStart: () => void
  onDragEnd: () => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: () => void
  isDragging: boolean
  isDropTarget: boolean
}
const PageTab = ({ page, isActive, onSelect, onRename, onDuplicate, onRemove, canRemove, isHome, onDragStart, onDragEnd, onDragOver, onDrop, isDragging, isDropTarget }: PageTabProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(page.name)
  const handleSave = () => {
    if (editName.trim()) onRename(editName.trim())
    setIsEditing(false)
  }
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave()
    else if (e.key === 'Escape') { setIsEditing(false); setEditName(page.name) }
  }
  return (
    <div className={`relative group flex-shrink-0 ${isDragging ? 'opacity-50' : ''} ${isDropTarget ? 'border-l-2 border-accent' : ''}`} draggable={!isHome && !isEditing} onDragStart={e => { if (!isHome) { e.dataTransfer.effectAllowed = 'move'; onDragStart() } }} onDragEnd={onDragEnd} onDragOver={e => { e.preventDefault(); onDragOver(e) }} onDrop={e => { e.preventDefault(); onDrop() }}>
      <div className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-all ${isActive ? 'bg-background-primary border-accent text-text-primary' : 'bg-background-tertiary border-transparent text-text-secondary hover:bg-background-secondary hover:text-text-primary'}`}>
        {!isHome && <GripVertical size={14} className="text-text-tertiary cursor-grab opacity-0 group-hover:opacity-100 transition-opacity" />}
        <button onClick={onSelect} onDoubleClick={() => { setIsEditing(true); setEditName(page.name) }} className="flex items-center gap-1 sm:gap-2">
          <FileText size={16} className={isActive ? 'text-accent' : 'text-text-tertiary'} />
          {isEditing ? (
            <input type="text" value={editName} onChange={e => setEditName(e.target.value)} onBlur={handleSave} onKeyDown={handleKeyDown} className="w-20 sm:w-24 px-2 py-1 text-sm bg-background-primary border border-accent rounded focus:outline-none" autoFocus onClick={e => e.stopPropagation()} />
          ) : (
            <span className="max-w-16 sm:max-w-24 truncate">{page.name}</span>
          )}
        </button>
        <Dropdown
          trigger={
            <button className={`p-1 sm:p-1.5 rounded-md transition-all text-text-tertiary hover:text-text-primary hover:bg-background-tertiary`} title="Page options">
              <MoreHorizontal size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
          }
        >
          <DropdownItem onSelect={() => { setIsEditing(true); setEditName(page.name) }}>
            <div className="flex items-center gap-2">
              <Edit2 size={16} className="text-text-secondary" />
              <span>Rename</span>
            </div>
          </DropdownItem>
          <DropdownItem onSelect={onDuplicate}>
            <div className="flex items-center gap-2">
              <Copy size={16} className="text-text-secondary" />
              <span>Duplicate</span>
            </div>
          </DropdownItem>
          {canRemove && (
            <>
              <DropdownSeparator />
              <DropdownItem onSelect={onRemove}>
                <div className="flex items-center gap-2 text-red-500 hover:text-red-600">
                  <Trash2 size={16} />
                  <span>Delete Page</span>
                </div>
              </DropdownItem>
            </>
          )}
        </Dropdown>
      </div>
    </div>
  )
}
const PageManager = () => {
  const { pages, currentPageId, addPage, removePage, renamePage, setCurrentPage, duplicatePage, reorderPages } = useCanvasStore()
  const [showAllPages, setShowAllPages] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null)
  const sortedPages = [...pages].sort((a, b) => a.order - b.order)
  const maxVisiblePages = typeof window !== 'undefined' && window.innerWidth < 640 ? 3 : 5
  const visiblePages = showAllPages ? sortedPages : sortedPages.slice(0, maxVisiblePages)
  const hasMorePages = sortedPages.length > maxVisiblePages
  const handleDragStart = (index: number) => setDraggedIndex(index)
  const handleDragEnd = () => { setDraggedIndex(null); setDropTargetIndex(null) }
  const handleDragOver = (index: number) => {
    if (draggedIndex !== null && draggedIndex !== index && index !== 0) setDropTargetIndex(index)
  }
  const handleDrop = (index: number) => {
    if (draggedIndex !== null && draggedIndex !== index && index !== 0) {
      reorderPages(draggedIndex, index)
    }
    setDraggedIndex(null)
    setDropTargetIndex(null)
  }
  const handleAddPage = () => {
    if (pages.length >= MAX_PAGES) return
    addPage()
  }
  const isInlineAddButton = pages.length <= 5
  return (
    <div className="flex items-center gap-1 px-2 py-1 bg-background-secondary border-b border-border overflow-hidden">
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide flex-1 min-w-0">
        {visiblePages.map((page, index) => (
          <PageTab key={page.id} page={page} isActive={page.id === currentPageId} onSelect={() => setCurrentPage(page.id)} onRename={name => renamePage(page.id, name)} onDuplicate={() => duplicatePage(page.id)} onRemove={() => removePage(page.id)} canRemove={pages.length > 1} isHome={page.order === 0} onDragStart={() => handleDragStart(index)} onDragEnd={handleDragEnd} onDragOver={() => handleDragOver(index)} onDrop={() => handleDrop(index)} isDragging={draggedIndex === index} isDropTarget={dropTargetIndex === index} />
        ))}
        {isInlineAddButton && pages.length < MAX_PAGES && (
          <Button variant="ghost" size="sm" onClick={handleAddPage} className="ml-1 gap-1 flex-shrink-0 text-text-tertiary" title="Add new page">
            <Plus size={16} />
            <span className="text-sm hidden sm:inline">Add Page</span>
          </Button>
        )}
      </div>
      {hasMorePages && (
        <button onClick={() => setShowAllPages(!showAllPages)} className="p-2 text-text-tertiary hover:text-text-secondary hover:bg-background-tertiary rounded flex-shrink-0" title={showAllPages ? 'Show less' : `Show all ${pages.length} pages`}>
          {showAllPages ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          {!showAllPages && <span className="text-xs ml-1 hidden sm:inline">+{pages.length - maxVisiblePages}</span>}
        </button>
      )}
      {!isInlineAddButton && (
        <Button variant="ghost" size="sm" onClick={handleAddPage} disabled={pages.length >= MAX_PAGES} className="ml-1 sm:ml-2 gap-1 flex-shrink-0" title={pages.length >= MAX_PAGES ? "Max pages reached" : "Add new page"}>
          <Plus size={16} />
          <span className="text-sm hidden sm:inline">Add Page</span>
        </Button>
      )}
      <div className="ml-auto hidden sm:flex items-center gap-2 text-xs text-text-tertiary flex-shrink-0">
        <span>{pages.length} / {MAX_PAGES} pages</span>
      </div>
    </div>
  )
}
export { PageManager }