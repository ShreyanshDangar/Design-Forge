import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import { ReactNode } from 'react'
import { Check, ChevronRight } from 'lucide-react'

interface DropdownProps {
  trigger: ReactNode
  children: ReactNode
  align?: 'start' | 'center' | 'end'
}
const Dropdown = ({ trigger, children, align = 'end' }: DropdownProps) => (
  <DropdownMenuPrimitive.Root>
    <DropdownMenuPrimitive.Trigger asChild>{trigger}</DropdownMenuPrimitive.Trigger>
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        align={align}
        sideOffset={4}
        className="z-50 min-w-[180px] bg-surface-elevated border border-border rounded-md shadow-dropdown p-1 animate-scale-in"
      >
        {children}
      </DropdownMenuPrimitive.Content>
    </DropdownMenuPrimitive.Portal>
  </DropdownMenuPrimitive.Root>
)
interface DropdownItemProps {
  children: ReactNode
  onSelect?: () => void
  disabled?: boolean
  shortcut?: string
}
const DropdownItem = ({ children, onSelect, disabled, shortcut }: DropdownItemProps) => (
  <DropdownMenuPrimitive.Item
    onSelect={onSelect}
    disabled={disabled}
    className="flex items-center justify-between h-8 px-3 text-base text-text-primary rounded cursor-pointer outline-none hover:bg-background-tertiary focus:bg-background-tertiary disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <span>{children}</span>
    {shortcut && <span className="text-xs text-text-tertiary ml-4">{shortcut}</span>}
  </DropdownMenuPrimitive.Item>
)
interface DropdownCheckboxItemProps {
  children: ReactNode
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}
const DropdownCheckboxItem = ({ children, checked, onCheckedChange }: DropdownCheckboxItemProps) => (
  <DropdownMenuPrimitive.CheckboxItem
    checked={checked}
    onCheckedChange={onCheckedChange}
    className="flex items-center h-8 px-3 text-base text-text-primary rounded cursor-pointer outline-none hover:bg-background-tertiary focus:bg-background-tertiary"
  >
    <span className="w-4 h-4 mr-2 flex items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check size={14} />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
)
const DropdownSeparator = () => (
  <DropdownMenuPrimitive.Separator className="h-px bg-border-subtle my-1 mx-2" />
)
const DropdownLabel = ({ children }: { children: ReactNode }) => (
  <DropdownMenuPrimitive.Label className="px-3 py-1.5 text-xs text-text-tertiary font-medium">
    {children}
  </DropdownMenuPrimitive.Label>
)
interface DropdownSubProps {
  trigger: ReactNode
  children: ReactNode
}
const DropdownSub = ({ trigger, children }: DropdownSubProps) => (
  <DropdownMenuPrimitive.Sub>
    <DropdownMenuPrimitive.SubTrigger className="flex items-center justify-between h-8 px-3 text-base text-text-primary rounded cursor-pointer outline-none hover:bg-background-tertiary focus:bg-background-tertiary">
      {trigger}
      <ChevronRight size={14} className="text-text-tertiary" />
    </DropdownMenuPrimitive.SubTrigger>
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.SubContent
        sideOffset={4}
        className="z-50 min-w-[180px] bg-surface-elevated border border-border rounded-md shadow-dropdown p-1 animate-scale-in"
      >
        {children}
      </DropdownMenuPrimitive.SubContent>
    </DropdownMenuPrimitive.Portal>
  </DropdownMenuPrimitive.Sub>
)
export { Dropdown, DropdownItem, DropdownCheckboxItem, DropdownSeparator, DropdownLabel, DropdownSub }