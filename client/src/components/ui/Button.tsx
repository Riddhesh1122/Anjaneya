import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const { isDark } = useTheme();

    const baseStyles =
      'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none';

    const sizeStyles: Record<ButtonSize, string> = {
      sm: 'px-3 py-1.5 text-xs gap-1.5',
      md: 'px-4 py-2.5 text-xs gap-2',
      lg: 'px-5 py-3 text-sm gap-2.5',
    };

    const variantStyles: Record<ButtonVariant, string> = {
      primary: 'bg-amber-500 text-zinc-950 hover:bg-amber-400 active:bg-amber-600 shadow-sm',
      secondary: isDark
        ? 'bg-zinc-800 text-zinc-100 hover:bg-zinc-700 border border-zinc-700/60'
        : 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 border border-zinc-200',
      outline: isDark
        ? 'border border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:border-zinc-700'
        : 'border border-zinc-300 text-zinc-700 hover:bg-zinc-50 hover:border-zinc-400',
      ghost: isDark
        ? 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
        : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100',
      danger: 'bg-rose-600 text-white hover:bg-rose-500 active:bg-rose-700 shadow-sm',
    };

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.97 }}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin flex-shrink-0" />
        ) : (
          leftIcon && <span className="flex-shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
