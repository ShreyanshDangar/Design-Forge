import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CanvasElement {
  id: string
  type: 'section' | 'text' | 'image' | 'shape'
  sectionType?: string
  x: number
  y: number
  width: number
  height: number
  locked: boolean
  visible: boolean
  content?: Record<string, unknown>
  children?: CanvasElement[]
}
export interface Page {
  id: string
  name: string
  slug: string
  elements: CanvasElement[]
  order: number
  backgroundColor?: string
}
interface HistoryEntry {
  pages: Page[]
  currentPageId: string
  selectedIds: string[]
}
interface CanvasState {
  pages: Page[]
  currentPageId: string
  elements: CanvasElement[]
  selectedIds: string[]
  zoom: number
  panX: number
  panY: number
  isPanning: boolean
  history: HistoryEntry[]
  historyIndex: number
  clipboard: CanvasElement[]
  canvasBackgroundColor: string
  setCanvasBackgroundColor: (color: string) => void
  setPageBackgroundColor: (pageId: string, color: string) => void
  getPageBackgroundColor: (pageId: string) => string | undefined
  addPage: (name?: string) => void
  removePage: (id: string) => void
  renamePage: (id: string, name: string) => void
  setCurrentPage: (id: string) => void
  reorderPages: (fromIndex: number, toIndex: number) => void
  duplicatePage: (id: string) => void
  addElement: (element: CanvasElement) => void
  removeElement: (id: string) => void
  updateElement: (id: string, updates: Partial<CanvasElement>) => void
  setElements: (elements: CanvasElement[]) => void
  selectElement: (id: string, addToSelection?: boolean) => void
  selectElements: (ids: string[]) => void
  clearSelection: () => void
  selectAll: () => void
  setZoom: (zoom: number) => void
  setPan: (x: number, y: number) => void
  setIsPanning: (isPanning: boolean) => void
  undo: () => void
  redo: () => void
  pushHistory: () => void
  copy: () => void
  paste: () => void
  duplicate: () => void
  deleteSelected: () => void
  bringToFront: () => void
  sendToBack: () => void
  bringForward: () => void
  sendBackward: () => void
  moveSelected: (dx: number, dy: number) => void
  toggleLock: (id: string) => void
  toggleVisibility: (id: string) => void
}
const generateId = () => Math.random().toString(36).substring(2, 15)
const createDefaultPage = (): Page => ({
  id: generateId(),
  name: 'Home',
  slug: 'index',
  elements: [],
  order: 0,
  backgroundColor: '#FFFFFF',
})
const getCurrentPageElements = (state: { pages: Page[]; currentPageId: string }): CanvasElement[] => {
  const currentPage = state.pages.find(p => p.id === state.currentPageId)
  return currentPage?.elements || []
}
const updateCurrentPageElements = (
  pages: Page[],
  currentPageId: string,
  updater: (elements: CanvasElement[]) => CanvasElement[]
): Page[] => {
  return pages.map(page =>
    page.id === currentPageId
      ? { ...page, elements: updater(page.elements) }
      : page
  )
}
export const useCanvasStore = create<CanvasState>()(
  persist(
    (set, get) => {
      const defaultPage = createDefaultPage()
      return {
        pages: [defaultPage],
        currentPageId: defaultPage.id,
        elements: [],
        selectedIds: [],
        zoom: 1,
        panX: 0,
        panY: 0,
        isPanning: false,
        history: [],
        historyIndex: -1,
        clipboard: [],
        canvasBackgroundColor: '#FFFFFF',
        setCanvasBackgroundColor: (color: string) => set({ canvasBackgroundColor: color }),
        setPageBackgroundColor: (pageId: string, color: string) => {
          set((state) => ({
            pages: state.pages.map(p =>
              p.id === pageId ? { ...p, backgroundColor: color } : p
            ),
          }))
        },
        getPageBackgroundColor: (pageId: string) => {
          const state = get()
          const page = state.pages.find(p => p.id === pageId)
          return page?.backgroundColor
        },
        addPage: (name?: string) => {
          const state = get()
          if (state.pages.length >= 20) return

          const pageCount = state.pages.length
          const newPage: Page = {
            id: generateId(),
            name: name || `Page ${pageCount + 1}`,
            slug: name?.toLowerCase().replace(/\s+/g, '-') || `page-${pageCount + 1}`,
            elements: [],
            order: pageCount,
            backgroundColor: '#FFFFFF',
          }
          state.pushHistory()
          set({
            pages: [...state.pages, newPage],
            currentPageId: newPage.id,
            selectedIds: [],
          })
        },
        removePage: (id: string) => {
          const state = get()
          if (state.pages.length <= 1) return
          state.pushHistory()
          const newPages = state.pages.filter(p => p.id !== id)
          const newCurrentId = state.currentPageId === id ? newPages[0].id : state.currentPageId
          set({
            pages: newPages.map((p, i) => ({ ...p, order: i })),
            currentPageId: newCurrentId,
            selectedIds: [],
          })
        },
        renamePage: (id: string, name: string) => {
          set((state) => ({
            pages: state.pages.map(p =>
              p.id === id
                ? { ...p, name, slug: name.toLowerCase().replace(/\s+/g, '-') }
                : p
            ),
          }))
        },
        setCurrentPage: (id: string) => {
          set({ currentPageId: id, selectedIds: [], panX: 0, panY: 0 })
        },
        reorderPages: (fromIndex: number, toIndex: number) => {
          const state = get()
          const newPages = [...state.pages]
          const [removed] = newPages.splice(fromIndex, 1)
          newPages.splice(toIndex, 0, removed)
          set({
            pages: newPages.map((p, i) => ({ ...p, order: i })),
          })
        },
        duplicatePage: (id: string) => {
          const state = get()
          const pageToDuplicate = state.pages.find(p => p.id === id)
          if (!pageToDuplicate) return
          state.pushHistory()
          const newPage: Page = {
            ...JSON.parse(JSON.stringify(pageToDuplicate)),
            id: generateId(),
            name: `${pageToDuplicate.name} (Copy)`,
            slug: `${pageToDuplicate.slug}-copy`,
            order: state.pages.length,
            backgroundColor: pageToDuplicate.backgroundColor || '#FFFFFF',
            elements: pageToDuplicate.elements.map(el => ({
              ...el,
              id: generateId(),
            })),
          }
          set({
            pages: [...state.pages, newPage],
            currentPageId: newPage.id,
            selectedIds: [],
          })
        },
        addElement: (element) => {
          const state = get()
          state.pushHistory()
          set({
            pages: updateCurrentPageElements(state.pages, state.currentPageId, (elements) => [
              ...elements,
              element,
            ]),
            selectedIds: [element.id],
          })
        },
        removeElement: (id) => {
          const state = get()
          state.pushHistory()
          set({
            pages: updateCurrentPageElements(state.pages, state.currentPageId, (elements) =>
              elements.filter((el) => el.id !== id)
            ),
            selectedIds: state.selectedIds.filter((sid) => sid !== id),
          })
        },
        updateElement: (id, updates) => {
          set((state) => ({
            pages: updateCurrentPageElements(state.pages, state.currentPageId, (elements) =>
              elements.map((el) => (el.id === id ? { ...el, ...updates } : el))
            ),
          }))
        },
        setElements: (elements) => {
          set((state) => ({
            pages: updateCurrentPageElements(state.pages, state.currentPageId, () => elements),
          }))
        },
        selectElement: (id, addToSelection = false) => {
          set((state) => {
            if (addToSelection) {
              const isSelected = state.selectedIds.includes(id)
              return {
                selectedIds: isSelected
                  ? state.selectedIds.filter((sid) => sid !== id)
                  : [...state.selectedIds, id],
              }
            }
            return { selectedIds: [id] }
          })
        },
        selectElements: (ids) => set({ selectedIds: ids }),
        clearSelection: () => set({ selectedIds: [] }),
        selectAll: () => {
          const state = get()
          const elements = getCurrentPageElements(state)
          set({ selectedIds: elements.map((el) => el.id) })
        },
        setZoom: (zoom) => set({ zoom: Math.max(0.25, Math.min(4, zoom)) }),
        setPan: (panX, panY) => set({ panX, panY }),
        setIsPanning: (isPanning) => set({ isPanning }),

        undo: () => {
          const state = get()
          if (state.historyIndex > 0) {
            const newIndex = state.historyIndex - 1
            const entry = state.history[newIndex]
            set({
              pages: entry.pages,
              currentPageId: entry.currentPageId,
              selectedIds: entry.selectedIds,
              historyIndex: newIndex,
            })
          }
        },
        redo: () => {
          const state = get()
          if (state.historyIndex < state.history.length - 1) {
            const newIndex = state.historyIndex + 1
            const entry = state.history[newIndex]
            set({
              pages: entry.pages,
              currentPageId: entry.currentPageId,
              selectedIds: entry.selectedIds,
              historyIndex: newIndex,
            })
          }
        },
        pushHistory: () => {
          const state = get()
          const entry: HistoryEntry = {
            pages: JSON.parse(JSON.stringify(state.pages)),
            currentPageId: state.currentPageId,
            selectedIds: [...state.selectedIds],
          }
          const newHistory = state.history.slice(0, state.historyIndex + 1)
          newHistory.push(entry)
          if (newHistory.length > 100) newHistory.shift()
          set({ history: newHistory, historyIndex: newHistory.length - 1 })
        },
        copy: () => {
          const state = get()
          const elements = getCurrentPageElements(state)
          const selected = elements.filter((el) => state.selectedIds.includes(el.id))
          set({ clipboard: JSON.parse(JSON.stringify(selected)) })
        },
        paste: () => {
          const state = get()
          if (state.clipboard.length === 0) return
          state.pushHistory()
          const newElements = state.clipboard.map((el) => ({
            ...el,
            id: generateId(),
            x: el.x + 20,
            y: el.y + 20,
          }))
          set({
            pages: updateCurrentPageElements(state.pages, state.currentPageId, (elements) => [
              ...elements,
              ...newElements,
            ]),
            selectedIds: newElements.map((el) => el.id),
            clipboard: newElements,
          })
        },
        duplicate: () => {
          const state = get()
          const elements = getCurrentPageElements(state)
          const selected = elements.filter((el) => state.selectedIds.includes(el.id))
          if (selected.length === 0) return
          state.pushHistory()
          const newElements = selected.map((el) => ({
            ...JSON.parse(JSON.stringify(el)),
            id: generateId(),
            x: el.x + 20,
            y: el.y + 20,
          }))
          set({
            pages: updateCurrentPageElements(state.pages, state.currentPageId, (elements) => [
              ...elements,
              ...newElements,
            ]),
            selectedIds: newElements.map((el) => el.id),
          })
        },
        deleteSelected: () => {
          const state = get()
          if (state.selectedIds.length === 0) return
          state.pushHistory()
          set({
            pages: updateCurrentPageElements(state.pages, state.currentPageId, (elements) =>
              elements.filter((el) => !state.selectedIds.includes(el.id))
            ),
            selectedIds: [],
          })
        },
        bringToFront: () => {
          const state = get()
          if (state.selectedIds.length === 0) return
          state.pushHistory()
          set({
            pages: updateCurrentPageElements(state.pages, state.currentPageId, (elements) => {
              const selected = elements.filter((el) => state.selectedIds.includes(el.id))
              const others = elements.filter((el) => !state.selectedIds.includes(el.id))
              return [...others, ...selected]
            }),
          })
        },
        sendToBack: () => {
          const state = get()
          if (state.selectedIds.length === 0) return
          state.pushHistory()
          set({
            pages: updateCurrentPageElements(state.pages, state.currentPageId, (elements) => {
              const selected = elements.filter((el) => state.selectedIds.includes(el.id))
              const others = elements.filter((el) => !state.selectedIds.includes(el.id))
              return [...selected, ...others]
            }),
          })
        },
        bringForward: () => {
          const state = get()
          if (state.selectedIds.length !== 1) return
          const elements = getCurrentPageElements(state)
          const index = elements.findIndex((el) => el.id === state.selectedIds[0])
          if (index === elements.length - 1) return
          state.pushHistory()
          set({
            pages: updateCurrentPageElements(state.pages, state.currentPageId, (elements) => {
              const newElements = [...elements]
              const temp = newElements[index]
              newElements[index] = newElements[index + 1]
              newElements[index + 1] = temp
              return newElements
            }),
          })
        },
        sendBackward: () => {
          const state = get()
          if (state.selectedIds.length !== 1) return
          const elements = getCurrentPageElements(state)
          const index = elements.findIndex((el) => el.id === state.selectedIds[0])
          if (index === 0) return
          state.pushHistory()
          set({
            pages: updateCurrentPageElements(state.pages, state.currentPageId, (elements) => {
              const newElements = [...elements]
              const temp = newElements[index]
              newElements[index] = newElements[index - 1]
              newElements[index - 1] = temp
              return newElements
            }),
          })
        },
        moveSelected: (dx, dy) => {
          set((state) => ({
            pages: updateCurrentPageElements(state.pages, state.currentPageId, (elements) =>
              elements.map((el) =>
                state.selectedIds.includes(el.id) && !el.locked
                  ? { ...el, x: el.x + dx, y: el.y + dy }
                  : el
              )
            ),
          }))
        },
        toggleLock: (id) => {
          set((state) => ({
            pages: updateCurrentPageElements(state.pages, state.currentPageId, (elements) =>
              elements.map((el) => (el.id === id ? { ...el, locked: !el.locked } : el))
            ),
          }))
        },
        toggleVisibility: (id) => {
          set((state) => ({
            pages: updateCurrentPageElements(state.pages, state.currentPageId, (elements) =>
              elements.map((el) => (el.id === id ? { ...el, visible: !el.visible } : el))
            ),
          }))
        },
      }
    },
    {
      name: 'designforge-canvas',
      partialize: (state) => ({
        pages: state.pages,
        currentPageId: state.currentPageId,
        canvasBackgroundColor: state.canvasBackgroundColor,
      }),
    }
  )
)