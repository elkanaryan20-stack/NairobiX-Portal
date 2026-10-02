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
      <div className={cn('w-full bg-white/[0.08] rounded-full overflow-hidden', sizeClasses[size])}>
        <div
          className="bg-primary transition-all duration-500 ease-out rounded-full h-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && <p className="text-sm text-fg-secondary mt-1">{percentage.toFixed(0)}%</p>}
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
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-fg-tertiary">{label}</p>
          <div className="mt-3 flex items-baseline gap-2">
            <h3 className="text-[1.75rem] font-medium leading-none tracking-tight text-fg tabular-nums">
              {value}
            </h3>
            {trend && (
              <span
                className={cn(
                  'text-xs font-semibold',
                  trend.direction === 'up' ? 'text-emerald-400' : 'text-red-400'
                )}
              >
                {trend.direction === 'up' ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
            )}
          </div>
          {subtitle && <p className="mt-2 text-xs text-fg-tertiary">{subtitle}</p>}
        </div>
        {icon && (
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-line bg-white/[0.03] text-fg-tertiary [&>svg]:h-4 [&>svg]:w-4">
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
    <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-line px-4 py-16 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.05] text-fg-tertiary [&>svg]:h-5 [&>svg]:w-5">
        {icon || <Inbox />}
      </div>
      <h3 className="mb-1.5 text-base font-semibold text-fg">{title}</h3>
      <p className="max-w-sm text-sm text-fg-tertiary">{description}</p>
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
            'bg-white/10 animate-pulse rounded-card mb-2',
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
      <div className="fixed inset-0 flex items-center justify-center bg-canvas/80">
        <div className={cn('border-4 border-line border-t-primary rounded-full animate-spin', sizes[size])} />
      </div>
    );
  }

  return <div className={cn('border-4 border-line border-t-primary rounded-full animate-spin', sizes[size])} />;
}

interface TabsProps {
  tabs: Array<{ label: string; value: string }>;
  activeTab: string;
  onTabChange: (value: string) => void;
}

export function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
  return (
    <div className="mb-6 flex overflow-x-auto border-b border-line" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          role="tab"
          aria-selected={activeTab === tab.value}
          onClick={() => onTabChange(tab.value)}
          className={cn(
            '-mb-px whitespace-nowrap border-b px-4 py-3 text-sm font-medium transition-colors',
            activeTab === tab.value
              ? 'border-primary text-fg'
              : 'border-transparent text-fg-tertiary hover:text-fg'
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
        'bg-white/10',
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
    info: { bg: 'bg-sky-500/[0.06]', border: 'border-sky-500/20', text: 'text-sky-300', Icon: Info },
    success: { bg: 'bg-emerald-500/[0.06]', border: 'border-emerald-500/20', text: 'text-emerald-300', Icon: CheckCircle2 },
    warning: { bg: 'bg-amber-500/[0.06]', border: 'border-amber-500/20', text: 'text-amber-300', Icon: AlertTriangle },
    error: { bg: 'bg-red-500/[0.06]', border: 'border-red-500/20', text: 'text-red-300', Icon: XCircle },
  };

  const style = typeStyles[type];
  const Icon = style.Icon;

  return (
    <div className={cn('rounded-xl border p-4', style.bg, style.border, style.text)}>
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
