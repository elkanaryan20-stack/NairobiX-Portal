import { Clock3 } from 'lucide-react';

/**
 * Shown where a Portal section has no authoritative NairobiX CRM source yet.
 * Visually distinct from an empty list (dashed, labelled "Not yet available")
 * so it never reads as a failure. Nothing is invented to fill the space.
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
          ? 'flex items-start gap-3 rounded-card border border-dashed border-line-strong p-4'
          : 'flex flex-col items-center justify-center rounded-card border border-dashed border-line-strong px-6 py-14 text-center'
      }
    >
      <div
        className={
          compact
            ? 'flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-line text-fg-tertiary'
            : 'mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-line text-fg-tertiary'
        }
      >
        <Clock3 className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-tertiary">Not yet available</p>
        <h3 className={compact ? 'mt-1 text-sm font-semibold text-fg' : 'mt-1.5 text-base font-semibold text-fg'}>{title}</h3>
        <p className={compact ? 'mt-0.5 text-sm text-fg-tertiary' : 'mx-auto mt-1 max-w-sm text-sm text-fg-tertiary'}>{description}</p>
      </div>
    </div>
  );
}
