import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, disabled, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium tracking-wide transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none min-h-[44px]'
    
    const variants = {
      primary: 'bg-primary text-white hover:bg-[#c45824] focus:ring-primary shadow-sm hover:shadow-md',
      secondary: 'bg-accent text-white hover:bg-[#c45824] focus:ring-accent',
      outline: 'border-2 border-primary text-primary hover:bg-[#c45824] hover:text-white hover:border-[#c45824] focus:ring-primary',
      ghost: 'text-gray-700 hover:bg-[#c45824] hover:text-white focus:ring-gray-500',
    }
    
    const sizes = {
      sm: 'px-3 py-2 text-xs sm:text-sm rounded-artistic',
      md: 'px-4 py-2.5 text-sm sm:text-base rounded-artistic',
      lg: 'px-6 py-3 text-sm sm:text-base rounded-xl',
    }

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
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
