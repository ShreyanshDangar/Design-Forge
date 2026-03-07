import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { ReactNode } from 'react'

interface TooltipProps {
  children: ReactNode
  content: string
  side?: 'top' | 'right' | 'bottom' | 'left'
  delayDuration?: number
}
const TooltipProvider = TooltipPrimitive.Provider
const Tooltip = ({ children, content, side = 'top', delayDuration = 400 }: TooltipProps) => {
  return (
    <TooltipPrimitive.Root delayDuration={delayDuration}>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side={side}
          sideOffset={4}
          className="z-50 bg-text-primary text-background-primary text-xs font-medium px-2 py-1 rounded shadow-lg animate-fade-in max-w-[200px]"
        >
          {content}
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  )
}
export { Tooltip, TooltipProvider }
export type { TooltipProps }