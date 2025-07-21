import { clsx, ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for className concatenation with Tailwind CSS
// Reference: HackerRank Clone document, Section 5.2 (Styling with CSS)

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}