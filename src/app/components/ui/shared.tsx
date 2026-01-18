import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'luxury', size?: 'sm' | 'md' | 'lg' }>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
          {
            'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500': variant === 'primary',
            'bg-slate-100 text-slate-900 hover:bg-slate-200 focus:ring-slate-500': variant === 'secondary',
            'hover:bg-slate-100 text-slate-700': variant === 'ghost',
            'bg-gradient-to-r from-amber-400 to-amber-600 text-white shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 border border-amber-300': variant === 'luxury',
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-4 py-2 text-base': size === 'md',
            'px-6 py-3 text-lg': size === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { variant?: 'default' | 'luxury' }>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50",
          {
            'border-slate-300 focus:border-blue-500 focus:ring-blue-500': variant === 'default',
            'border-amber-200/30 bg-black/20 text-white placeholder:text-amber-100/50 focus:border-amber-400 focus:ring-amber-400/50 backdrop-blur-md': variant === 'luxury',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'luxury' }>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl",
          {
            'bg-white border border-slate-200 shadow-sm': variant === 'default',
            'bg-black/40 border border-amber-500/20 shadow-2xl backdrop-blur-xl text-white': variant === 'luxury',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";
