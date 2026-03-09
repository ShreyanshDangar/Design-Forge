import { useState, useMemo, useEffect } from 'react'
import { fonts, fontCategories, FontInfo } from '../../data/fonts'
import { useTypographyStore } from '../../stores/typographyStore'
import { Button } from '../ui'
import { Star, Check, ChevronDown, ChevronRight } from 'lucide-react'

interface FontBrowserProps { searchQuery: string }
const loadFont = (family: string) => {
  const linkId = `font-${family.replace(/\s/g, '-')}`
  if (document.getElementById(linkId)) return
  const link = document.createElement('link')
  link.id = linkId
  link.href = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, '+')}:wght@400;500;600;700&display=swap`
  link.rel = 'stylesheet'
  document.head.appendChild(link)
}
interface FontCardProps {
  font: FontInfo
  isSelected: boolean
  isFavorite: boolean
  onSelect: () => void
  onToggleFavorite: () => void
}
const FontCard = ({ font, isSelected, isFavorite, onSelect, onToggleFavorite }: FontCardProps) => {
  useEffect(() => { loadFont(font.family) }, [font.family])
  return (
    <div
      className={`group p-4 rounded-lg border transition-all cursor-pointer ${isSelected
        ? 'border-accent bg-background-secondary shadow-elevated'
        : 'border-border hover:border-text-tertiary hover:shadow-subtle'
        }`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs text-text-tertiary font-medium uppercase tracking-wide">{font.category}</span>
        <div className="flex items-center gap-2">
          {isSelected && <Check size={20} className="text-accent" />}
          <button
            className={`p-1.5 rounded transition-all ${isFavorite ? 'opacity-100' : 'opacity-0 group-hover:opacity-50 hover:!opacity-100'
              }`}
            onClick={e => { e.stopPropagation(); onToggleFavorite() }}
          >
            <Star size={18} className={isFavorite ? 'fill-accent text-accent' : 'text-text-tertiary'} />
          </button>
        </div>
      </div>
      <p
        className="text-2xl leading-tight text-text-primary truncate font-medium mb-2"
        style={{ fontFamily: `"${font.family}", sans-serif` }}
      >
        {font.family}
      </p>
      <p
        className="text-sm text-text-secondary truncate"
        style={{ fontFamily: `"${font.family}", sans-serif` }}
      >
        The quick brown fox jumps over
      </p>
    </div>
  )
}
interface CollapsibleFontCategoryProps {
  category: string
  categoryFonts: FontInfo[]
  selectedFont: string
  favoriteFonts: string[]
  onSelectFont: (font: FontInfo) => void
  onToggleFavorite: (family: string) => void
}
const CollapsibleFontCategory = ({
  category,
  categoryFonts,
  selectedFont,
  favoriteFonts,
  onSelectFont,
  onToggleFavorite
}: CollapsibleFontCategoryProps) => {
  const [isExpanded, setIsExpanded] = useState(true)
  return (
    <div className="mb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-2 py-3 px-3 rounded-lg bg-background-tertiary hover:bg-border transition-colors mb-3"
      >
        <div className="w-8 h-8 flex items-center justify-center rounded bg-accent/10">
          {isExpanded ? (
            <ChevronDown size={20} className="text-accent" />
          ) : (
            <ChevronRight size={20} className="text-accent" />
          )}
        </div>
        <h4 className="text-base font-semibold text-text-primary uppercase tracking-wider flex-1 text-left">
          {category}
        </h4>
        <span className="text-sm text-text-tertiary bg-background-secondary px-2 py-0.5 rounded">
          {categoryFonts.length} fonts
        </span>
      </button>
      {isExpanded && (
        <div className="space-y-3">
          {categoryFonts.map(font => (
            <FontCard
              key={font.family}
              font={font}
              isSelected={font.family === selectedFont}
              isFavorite={favoriteFonts.includes(font.family)}
              onSelect={() => onSelectFont(font)}
              onToggleFavorite={() => onToggleFavorite(font.family)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
const FontBrowser = ({ searchQuery }: FontBrowserProps) => {
  const {
    headingFont,
    bodyFont,
    setHeadingFont,
    setBodyFont,
    favoriteFonts,
    toggleFavoriteFont,
    addRecentFont
  } = useTypographyStore()
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [mode, setMode] = useState<'heading' | 'body'>('heading')
  const selectedFont = mode === 'heading' ? headingFont : bodyFont
  const filteredFonts = useMemo(() => {
    let result = fonts
    if (activeCategory === 'Favorites') {
      result = result.filter(f => favoriteFonts.includes(f.family))
    } else if (activeCategory) {
      result = result.filter(f => f.category === activeCategory)
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(f => f.family.toLowerCase().includes(q) || f.category.toLowerCase().includes(q))
    }
    return result
  }, [activeCategory, searchQuery, favoriteFonts])
  const groupedFonts = useMemo(() => {
    const groups: Record<string, FontInfo[]> = {}
    filteredFonts.forEach(font => {
      const cat = activeCategory === 'Favorites' ? 'Favorites' : font.category
      if (!groups[cat]) groups[cat] = []
      groups[cat].push(font)
    })
    return groups
  }, [filteredFonts, activeCategory])
  const handleSelect = (font: FontInfo) => {
    if (mode === 'heading') {
      setHeadingFont(font.family)
    } else {
      setBodyFont(font.family)
    }
    addRecentFont(font.family)
  }
  return (
    <div className="p-4">
      <div className="grid grid-cols-3 gap-1.5 mb-5 p-2 bg-background-tertiary rounded-lg">
        <Button
          variant={activeCategory === null ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setActiveCategory(null)}
          className="text-sm font-medium w-full"
        >
          All
        </Button>
        <Button
          variant={activeCategory === 'Favorites' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setActiveCategory('Favorites')}
          className="text-sm font-medium w-full"
        >
          <Star size={14} className="mr-1.5" />
          Favs
        </Button>
        {fontCategories.map(cat => (
          <Button
            key={cat}
            variant={activeCategory === cat ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setActiveCategory(cat)}
            className="text-sm font-medium w-full truncate"
            title={cat}
          >
            {cat}
          </Button>
        ))}
      </div>
      <div className="space-y-2">
        {Object.entries(groupedFonts).map(([category, categoryFonts]) => (
          <CollapsibleFontCategory
            key={category}
            category={category}
            categoryFonts={categoryFonts}
            selectedFont={selectedFont}
            favoriteFonts={favoriteFonts}
            onSelectFont={handleSelect}
            onToggleFavorite={toggleFavoriteFont}
          />
        ))}
      </div>
      {filteredFonts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-base text-text-tertiary">No fonts found</p>
          {activeCategory === 'Favorites' && (
            <p className="text-sm text-text-tertiary mt-2">
              Click the star icon on any font to add it to favorites
            </p>
          )}
        </div>
      )}
    </div>
  )
}
export { FontBrowser }