/** Shell-shaped skeleton shown while the Portal resolves access and loads a module. */
export default function PortalLoading() {
  return (
    <div className="flex h-screen bg-canvas" role="status" aria-label="Loading your NairobiX Portal">
      <aside className="hidden w-64 flex-shrink-0 border-r border-line bg-canvas p-5 md:block">
        <div className="mb-8 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          <span className="text-sm font-semibold tracking-wide text-fg">NairobiX</span>
        </div>
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-9 animate-pulse rounded-sm bg-white/[0.04]" style={{ animationDelay: `${i * 80}ms` }} />
          ))}
        </div>
      </aside>
      <div className="flex-1 px-5 pt-20 md:px-8 md:pt-8">
        <div className="mb-8 h-8 w-56 animate-pulse rounded-sm bg-white/[0.06]" />
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-card border border-line bg-surface" />
          ))}
        </div>
        <div className="mt-6 h-64 animate-pulse rounded-card border border-line bg-surface" />
      </div>
    </div>
  );
}
