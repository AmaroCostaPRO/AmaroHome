export default function MediaLoading() {
  return (
    <div className="space-y-8 max-w-6xl animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-white/5 rounded-md" />
          <div className="h-4 w-64 bg-white/5 rounded-md" />
        </div>
        <div className="h-10 w-40 bg-white/5 rounded-md" />
      </div>

      {/* Media Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="rounded-xl overflow-hidden glass-panel border border-white/5">
            {/* Aspect Ratio Box */}
            <div className="aspect-square bg-white/5 w-full" />
            <div className="p-3 space-y-2">
              <div className="h-4 w-3/4 bg-white/5 rounded-md" />
              <div className="h-3 w-1/2 bg-white/5 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
