import { Clock3 } from 'lucide-react';

/**
 * Shown where a Portal section has no authoritative NairobiX CRM source yet.
 * Nothing is invented to fill the space.
 */
export function NotYetAvailable({
  title = 'Not yet available',
  description = 'This section will appear here once NairobiX makes it available in your Portal.',
  compact = false,
}: {
  title?: string;
  description?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={
        compact
          ? 'flex items-start gap-3 rounded-card border border-dashed border-line p-5'
          : 'flex flex-col items-center justify-center rounded-card border border-dashed border-line px-4 py-16 text-center'
      }
    >
      <div
        className={
          compact
            ? 'flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white/[0.05] text-fg-tertiary'
            : 'mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.05] text-fg-tertiary'
        }
      >
        <Clock3 className={compact ? 'h-4 w-4' : 'h-5 w-5'} />
      </div>
      <div>
        <h3 className={compact ? 'text-sm font-semibold text-fg' : 'mb-1.5 text-base font-semibold text-fg'}>
          {title}
        </h3>
        <p className={compact ? 'mt-0.5 text-sm text-fg-tertiary' : 'max-w-sm text-sm text-fg-tertiary'}>{description}</p>
      </div>
    </div>
  );
}
