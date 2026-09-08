import React from 'react';
import { Inbox, Info, CheckCircle2, AlertTriangle, XCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className, ...props }: InputProps) {
  return <input className={cn('input', className)} {...props} />;
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export function Textarea({ className, ...props }: TextareaProps) {
  return <textarea className={cn('input', className)} {...props} />;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options?: Array<{ value: string; label: string }>;
}

export function Select({ className, options, ...props }: SelectProps) {
  return (
    <select className={cn('input', className)} {...props}>
      {options?.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

interface ProgressBarProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ProgressBar({ value, max = 100, showLabel = true, size = 'md' }: ProgressBarProps) {
  const percentage = (value / max) * 100;

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className="w-full">
      <div className={cn('w-full bg-neutral-200 rounded-full overflow-hidden', sizeClasses[size])}>
        <div
          className="bg-primary transition-all duration-500 ease-out rounded-full h-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && <p className="text-sm text-neutral-600 mt-1">{percentage.toFixed(0)}%</p>}
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  icon?: React.ReactNode;
}

export function MetricCard({ label, value, subtitle, trend, icon }: MetricCardProps) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">{label}</p>
          <div className="mt-2.5 flex items-baseline gap-2">
            <h3 className="text-[1.75rem] font-semibold leading-none tracking-tight text-neutral-900">
              {value}
            </h3>
            {trend && (
              <span
                className={cn(
                  'text-xs font-semibold',
                  trend.direction === 'up' ? 'text-emerald-600' : 'text-red-600'
                )}
              >
                {trend.direction === 'up' ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
            )}
          </div>
          {subtitle && <p className="mt-2 text-xs text-neutral-500">{subtitle}</p>}
        </div>
        {icon && (
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 [&>svg]:h-4 [&>svg]:w-4">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-neutral-200 px-4 py-16 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-400 [&>svg]:h-5 [&>svg]:w-5">
        {icon || <Inbox />}
      </div>
      <h3 className="mb-1.5 text-base font-semibold text-neutral-900">{title}</h3>
      <p className="max-w-sm text-sm text-neutral-500">{description}</p>
      {action && (
        <button onClick={action.onClick} className="btn btn-primary mt-6">
          {action.label}
        </button>
      )}
    </div>
  );
}

interface SkeletonProps {
  className?: string;
  count?: number;
  height?: string;
  circle?: boolean;
}

export function Skeleton({ className, count = 1, height = 'h-4', circle = false }: SkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'bg-neutral-200 animate-pulse rounded-md mb-2',
            height,
            circle && 'rounded-full',
            className
          )}
        />
      ))}
    </>
  );
}

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  fullPage?: boolean;
}

export function LoadingSpinner({ size = 'md', fullPage = false }: LoadingSpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        <div className={cn('border-4 border-neutral-200 border-t-primary rounded-full animate-spin', sizes[size])} />
      </div>
    );
  }

  return <div className={cn('border-4 border-neutral-200 border-t-primary rounded-full animate-spin', sizes[size])} />;
}

interface TabsProps {
  tabs: Array<{ label: string; value: string }>;
  activeTab: string;
  onTabChange: (value: string) => void;
}

export function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
  return (
    <div className="flex border-b border-neutral-200 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onTabChange(tab.value)}
          className={cn(
            'px-4 py-3 font-medium text-sm transition-colors border-b-2 -mb-px',
            activeTab === tab.value
              ? 'text-primary border-primary'
              : 'text-neutral-600 border-transparent hover:text-neutral-900'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

interface DividerProps {
  className?: string;
  variant?: 'horizontal' | 'vertical';
}

export function Divider({ className, variant = 'horizontal' }: DividerProps) {
  return (
    <div
      className={cn(
        'bg-neutral-200',
        variant === 'horizontal' ? 'h-px w-full' : 'w-px h-full',
        className
      )}
    />
  );
}

interface AlertProps {
  title: string;
  description?: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  onClose?: () => void;
}

export function Alert({ title, description, type = 'info', onClose }: AlertProps) {
  const typeStyles = {
    info: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', Icon: Info },
    success: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800', Icon: CheckCircle2 },
    warning: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', Icon: AlertTriangle },
    error: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', Icon: XCircle },
  };

  const style = typeStyles[type];
  const Icon = style.Icon;

  return (
    <div className={cn('rounded-sm border p-4', style.bg, style.border, style.text)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <Icon className="mt-0.5 flex-shrink-0" size={18} />
          <div>
            <h4 className="font-medium">{title}</h4>
            {description && <p className="text-sm mt-1 opacity-90">{description}</p>}
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="flex-shrink-0 opacity-60 hover:opacity-100">
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
