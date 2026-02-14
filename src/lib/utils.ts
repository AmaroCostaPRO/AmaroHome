import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combina classes condicionalmente e resolve conflitos Tailwind.
 * Uso: cn('base', condition && 'active', 'override')
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
