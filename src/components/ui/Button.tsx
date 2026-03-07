import { forwardRef, ButtonHTMLAttributes } from 'react'
import { motion } from 'framer-motion'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'icon'
type ButtonSize = 'sm' | 'md'
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
}
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, className = '', children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-150 focus-ring rounded'
    const variants: Record<ButtonVariant, string> = {
      primary: 'bg-accent text-background-secondary hover:bg-accent-hover active:scale-[0.98]',
      secondary: 'bg-transparent border border-border text-text-primary hover:bg-background-tertiary active:scale-[0.98]',
      ghost: 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-background-tertiary',
      icon: 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-background-tertiary',
    }
    const sizes: Record<ButtonSize, string> = {
      sm: variant === 'icon' ? 'w-8 h-8' : 'h-8 px-3 text-sm',
      md: variant === 'icon' ? 'w-10 h-10' : 'h-10 px-4 text-base',
    }
    return (
      <motion.button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        disabled={disabled || loading}
        whileTap={!disabled && !loading ? { scale: 0.98 } : undefined}
        {...(props as object)}
      >
        {loading ? (
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : children}
      </motion.button>
    )
  }
)
Button.displayName = 'Button'
export { Button }
export type { ButtonProps, ButtonVariant, ButtonSize }