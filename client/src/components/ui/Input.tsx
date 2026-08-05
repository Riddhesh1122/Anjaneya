import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  isPassword?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      isPassword = false,
      type = 'text',
      className = '',
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const { isDark } = useTheme();
    const [showPassword, setShowPassword] = useState(false);

    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    const inputBg = isDark
      ? 'bg-zinc-900 border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:border-amber-500/60 focus:ring-amber-500/20'
      : 'bg-white border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:border-amber-500/60 focus:ring-amber-500/20';

    const inputError = error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : '';

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className={`text-xs font-semibold ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className={`absolute left-3 flex items-center pointer-events-none ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={isPassword ? (showPassword ? 'text' : 'password') : type}
            disabled={disabled}
            className={`w-full py-2.5 text-xs rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed ${
              leftIcon ? 'pl-9' : 'pl-3.5'
            } ${isPassword ? 'pr-9' : 'pr-3.5'} ${inputBg} ${inputError} ${className}`}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute right-3 p-1 rounded-md transition-colors cursor-pointer ${
                isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-700'
              }`}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>

        {error ? (
          <span className="text-[11px] text-rose-500 font-medium">{error}</span>
        ) : helperText ? (
          <span className={`text-[11px] ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>{helperText}</span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
