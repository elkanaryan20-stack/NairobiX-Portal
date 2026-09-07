import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes intelligently
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format date to readable string
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format currency
 */
export function formatCurrency(amount: number, currency: string = 'KES'): string {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format percentage
 */
export function formatPercent(value: number, decimals: number = 0): string {
  return `${(value).toFixed(decimals)}%`;
}

/**
 * Format large numbers with K, M, B notation
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

/**
 * Get status badge color classes
 */
export function getStatusColor(
  status: string
): { bg: string; text: string; border: string } {
  const statusMap: Record<string, { bg: string; text: string; border: string }> = {
    active: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    completed: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    'in-progress': {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
    },
    pending: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
    'on-hold': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
    paused: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
    paid: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    approved: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    rejected: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
    submitted: { bg: 'bg-neutral-50', text: 'text-neutral-700', border: 'border-neutral-200' },
    won: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    lost: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
    qualified: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    inactive: { bg: 'bg-neutral-50', text: 'text-neutral-700', border: 'border-neutral-200' },
    'under-review': {
      bg: 'bg-yellow-50',
      text: 'text-yellow-700',
      border: 'border-yellow-200',
    },
  };

  return statusMap[status] || statusMap.pending;
}

/**
 * Get priority badge color classes
 */
export function getPriorityColor(
  priority: string
): { bg: string; text: string; border: string } {
  const priorityMap: Record<string, { bg: string; text: string; border: string }> = {
    low: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    medium: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
    high: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
    urgent: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  };

  return priorityMap[priority] || priorityMap.medium;
}

/**
 * Get trend icon and color
 */
export function getTrendIndicator(trend: 'up' | 'down' | 'stable'): string {
  const trendMap = {
    up: '📈',
    down: '📉',
    stable: '➡️',
  };
  return trendMap[trend] || '➡️';
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

/**
 * Calculate days until date
 */
export function daysUntil(date: string | Date): number {
  const d = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  const diffTime = d.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Format relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;

  return formatDate(d);
}
