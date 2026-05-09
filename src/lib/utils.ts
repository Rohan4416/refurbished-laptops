import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(price)
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `ORD-${timestamp}-${random}`
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

export function calculateSavings(originalPrice: number, currentPrice: number): number {
  return originalPrice - currentPrice
}

export function calculateSavingsPercentage(originalPrice: number, currentPrice: number): number {
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
}

export function getConditionColor(condition: string): string {
  const colors: Record<string, string> = {
    PRISTINE: 'text-emerald-700',
    EXCELLENT: 'text-emerald-600',
    GOOD: 'text-amber-700',
    FAIR: 'text-stone-600',
  }
  return colors[condition] || 'text-stone-600'
}

export function getConditionBgColor(condition: string): string {
  const colors: Record<string, string> = {
    PRISTINE: 'bg-emerald-100',
    EXCELLENT: 'bg-emerald-50',
    GOOD: 'bg-amber-50',
    FAIR: 'bg-stone-100',
  }
  return colors[condition] || 'bg-stone-100'
}