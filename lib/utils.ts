import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility function to format price ranges
export function formatPriceRange(priceRange: string): string {
  return priceRange.replace(/\$(\d+)-(\d+)/, "$$$1 - $$$2")
}

// Utility function to get category display name
export function getCategoryDisplayName(categoryId: string): string {
  const categoryMap: Record<string, string> = {
    singers: "Singer",
    djs: "DJ",
    dancers: "Dancer",
    speakers: "Speaker",
  }
  return categoryMap[categoryId] || categoryId
}

// Utility function to validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Utility function to truncate text
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + "..."
}
