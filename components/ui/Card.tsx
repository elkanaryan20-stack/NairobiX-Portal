import React from 'react';
import { Loader2 } from 'lucide-react';
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
  variant?: 'primary' | 'success' | 'warning' | 'neutral' | 'danger' | 'info';
  dot?: boolean;
}

export function Badge({ children, variant = 'neutral', dot = true, className, ...props }: BadgeProps) {
  const variants = {
    primary: 'badge-primary',
    success: 'badge-success',
    warning: 'badge-warning',
    neutral: 'badge-neutral',
    danger: 'badge-danger',
    info: 'badge-info',
  };

  return (
    <span className={cn('badge', variants[variant], className)} {...props}>
      {dot && <span className="badge-dot" aria-hidden="true" />}
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
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        icon && <span className="inline-flex">{icon}</span>
      )}
      {children}
      {!isLoading && rightIcon && <span className="inline-flex">{rightIcon}</span>}
    </button>
  );
}

interface StatusBadgeProps {
  status: string;
}

type BadgeVariant = 'success' | 'warning' | 'danger' | 'primary' | 'neutral' | 'info';

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusMap: Record<string, { label: string; variant: BadgeVariant }> = {
    active: { label: 'Active', variant: 'success' },
    completed: { label: 'Completed', variant: 'success' },
    'in-progress': { label: 'In Progress', variant: 'info' },
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
    planning: { label: 'Planning', variant: 'neutral' },
    contacted: { label: 'Contacted', variant: 'info' },
    proposal: { label: 'Proposal', variant: 'warning' },
    sent: { label: 'Sent', variant: 'info' },
    viewed: { label: 'Viewed', variant: 'info' },
    overdue: { label: 'Overdue', variant: 'danger' },
    draft: { label: 'Draft', variant: 'neutral' },
    onboarding: { label: 'Onboarding', variant: 'info' },
    acknowledged: { label: 'Acknowledged', variant: 'info' },
    assigned: { label: 'Assigned', variant: 'info' },
    resolved: { label: 'Resolved', variant: 'success' },
    archived: { label: 'Archived', variant: 'neutral' },
    available: { label: 'Available', variant: 'success' },
    used: { label: 'Used', variant: 'neutral' },
    expired: { label: 'Expired', variant: 'danger' },
    'not-started': { label: 'Not Started', variant: 'neutral' },
    'not-submitted': { label: 'Not Submitted', variant: 'neutral' },
    'in-review': { label: 'In Review', variant: 'warning' },
    verified: { label: 'Verified', variant: 'success' },
    'not-uploaded': { label: 'Not Uploaded', variant: 'neutral' },
    uploaded: { label: 'Uploaded', variant: 'info' },
    locked: { label: 'Locked', variant: 'neutral' },
    requested: { label: 'Requested', variant: 'neutral' },
    scheduled: { label: 'Scheduled', variant: 'info' },
    cancelled: { label: 'Cancelled', variant: 'danger' },
    'revision-requested': { label: 'Revision Requested', variant: 'warning' },
    converted: { label: 'Converted', variant: 'success' },
    new: { label: 'New', variant: 'info' },
    verification: { label: 'Verification', variant: 'warning' },
    assessment: { label: 'Assessment', variant: 'warning' },
  };

  const config = statusMap[status] || statusMap.pending;
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

interface PriorityBadgeProps {
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const priorityMap: Record<string, { label: string; variant: BadgeVariant }> = {
    low: { label: 'Low', variant: 'neutral' },
    medium: { label: 'Medium', variant: 'info' },
    high: { label: 'High', variant: 'primary' },
    urgent: { label: 'Urgent', variant: 'danger' },
  };

  const config = priorityMap[priority];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
