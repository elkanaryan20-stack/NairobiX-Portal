import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
}

export function Card({ children, hover = false, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'card',
        hover && 'card-hover',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'neutral' | 'danger';
}

export function Badge({ children, variant = 'neutral', className, ...props }: BadgeProps) {
  const variants = {
    primary: 'badge-primary',
    success: 'badge-success',
    warning: 'badge-warning',
    neutral: 'badge-neutral',
    danger: 'bg-red-100 text-red-800',
  };

  return (
    <span className={cn('badge', variants[variant], className)} {...props}>
      {children}
    </span>
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  rightIcon,
  isLoading,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={cn('btn', variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
      {isLoading && <span className="ml-2 inline-block animate-spin">⟳</span>}
    </button>
  );
}

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusMap: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' | 'primary' | 'neutral' }> = {
    active: { label: 'Active', variant: 'success' },
    completed: { label: 'Completed', variant: 'success' },
    'in-progress': { label: 'In Progress', variant: 'primary' },
    pending: { label: 'Pending', variant: 'warning' },
    'on-hold': { label: 'On Hold', variant: 'warning' },
    paused: { label: 'Paused', variant: 'warning' },
    paid: { label: 'Paid', variant: 'success' },
    approved: { label: 'Approved', variant: 'success' },
    rejected: { label: 'Rejected', variant: 'danger' },
    submitted: { label: 'Submitted', variant: 'neutral' },
    won: { label: 'Won', variant: 'success' },
    lost: { label: 'Lost', variant: 'danger' },
    qualified: { label: 'Qualified', variant: 'primary' },
    inactive: { label: 'Inactive', variant: 'neutral' },
    'under-review': { label: 'Under Review', variant: 'warning' },
  };

  const config = statusMap[status] || statusMap.pending;
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

interface PriorityBadgeProps {
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const priorityMap: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' | 'primary' | 'neutral' }> = {
    low: { label: '🔵 Low', variant: 'neutral' },
    medium: { label: '🟡 Medium', variant: 'warning' },
    high: { label: '🟠 High', variant: 'warning' },
    urgent: { label: '🔴 Urgent', variant: 'danger' },
  };

  const config = priorityMap[priority];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
