import * as DialogPrimitive from '@radix-ui/react-dialog'
import { ReactNode } from 'react'
import { X } from 'lucide-react'
import { Button } from './Button'

interface ModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}
const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
}
const Modal = ({ open, onOpenChange, title, description, children, size = 'md' }: ModalProps) => (
  <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in" />
      <DialogPrimitive.Content className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 w-full ${sizeClasses[size]} bg-surface-elevated border border-border rounded-lg shadow-modal p-6 animate-scale-in`}>
        <div className="flex items-center justify-between mb-4">
          <DialogPrimitive.Title className="text-lg font-semibold text-text-primary">
            {title}
          </DialogPrimitive.Title>
          <DialogPrimitive.Close asChild>
            <Button variant="ghost" size="sm" className="w-7 h-7">
              <X size={16} />
            </Button>
          </DialogPrimitive.Close>
        </div>
        {description && (
          <DialogPrimitive.Description className="text-sm text-text-secondary mb-4">
            {description}
          </DialogPrimitive.Description>
        )}
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  </DialogPrimitive.Root>
)
export { Modal }
export type { ModalProps }