import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, disabled, children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium tracking-wide transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none min-h-[44px]'

    const variants = {
      primary:
        'bg-primary text-white hover:bg-[#5a2d8a] focus:ring-primary shadow-sm hover:shadow-md',
      secondary:
        'bg-[color:var(--bronze)] text-white hover:bg-[#8f7556] focus:ring-[color:var(--bronze)]',
      outline:
        'border border-[color:var(--anthracite)]/25 text-[color:var(--anthracite)] hover:border-[color:var(--bronze)] hover:text-[color:var(--bronze)] focus:ring-[color:var(--bronze)] bg-transparent',
      ghost:
        'text-[color:var(--anthracite)] hover:bg-[color:var(--sand)] focus:ring-[color:var(--sand)]',
    }

    const sizes = {
      sm: 'px-3 py-2 text-xs sm:text-sm rounded-xl',
      md: 'px-4 py-2.5 text-sm sm:text-base rounded-xl',
      lg: 'px-6 py-3 text-sm sm:text-base rounded-xl',
    }

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
