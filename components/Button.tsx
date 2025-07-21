'use client';

import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

// Reusable button component with primary/secondary variants
// Reference: HackerRank Clone document, Section 5.2 (Reusable Components)

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export default function Button({ variant = 'primary', className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'btn',
        variant === 'primary' ? 'btn-primary' : 'btn-secondary',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}