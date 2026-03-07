import { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface PanelProps {
  children: ReactNode
  className?: string
  side?: 'left' | 'right'
  isOpen?: boolean
  width?: number
  isMobile?: boolean
  isTablet?: boolean
}
const Panel = ({ children, className = '', side = 'left', isOpen = true, width = 280, isMobile = false, isTablet = false }: PanelProps) => {
  const isSmallScreen = isMobile || isTablet
  if (isSmallScreen) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: side === 'left' ? '-100%' : '100%', opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: side === 'left' ? '-100%' : '100%', opacity: 0.5 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={`fixed top-0 bottom-0 h-full bg-background-secondary flex-shrink-0 overflow-hidden z-50 ${side === 'left' ? 'left-0 border-r-2 border-border shadow-[4px_0_16px_rgba(0,0,0,0.15)]' : 'right-0 border-l-2 border-border shadow-[-4px_0_16px_rgba(0,0,0,0.15)]'} ${className}`}
            style={{ width: Math.min(width, typeof window !== 'undefined' ? window.innerWidth - 40 : width) }}
          >
            <div className="h-full overflow-y-auto overflow-x-hidden" style={{ width: Math.min(width, typeof window !== 'undefined' ? window.innerWidth - 40 : width) }}>
              {children}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    )
  }
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className={`h-full bg-background-secondary flex-shrink-0 overflow-hidden ${side === 'left' ? 'border-r-2 border-border shadow-[2px_0_8px_rgba(0,0,0,0.08)]' : 'border-l-2 border-border shadow-[-2px_0_8px_rgba(0,0,0,0.08)]'} ${className}`}
        >
          <div className="h-full overflow-y-auto overflow-x-hidden" style={{ width }}>
            {children}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
export { Panel }
export type { PanelProps }