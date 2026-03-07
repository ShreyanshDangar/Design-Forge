import { forwardRef, InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
  selectOnFocus?: boolean
}
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', selectOnFocus = true, onFocus, ...props }, ref) => {
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      if (selectOnFocus) {
        e.target.select()
      }
      onFocus?.(e)
    }
    return (
      <div className="flex flex-col gap-1.5">
        {label && <label className="text-sm text-text-secondary font-medium">{label}</label>}
        <div className="relative">
          {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary">{icon}</span>}
          <input
            ref={ref}
            onFocus={handleFocus}
            className={`w-full h-10 bg-background-secondary border border-border rounded-md px-3 text-base text-text-primary placeholder:text-text-tertiary transition-colors duration-150 focus:border-accent focus:ring-1 focus:ring-accent/20 ${icon ? 'pl-10' : ''} ${error ? 'border-red-500' : ''} ${className}`}
            {...props}
          />
        </div>
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    )
  }
)
Input.displayName = 'Input'
export { Input }
export type { InputProps }