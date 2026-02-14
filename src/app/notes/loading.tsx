export default function NotesLoading() {
  return (
    <div className="space-y-8 max-w-5xl animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-32 bg-white/5 rounded-md" />
          <div className="h-4 w-48 bg-white/5 rounded-md" />
        </div>
        <div className="h-10 w-36 bg-white/5 rounded-md" />
      </div>

      {/* Notes Grid Skeleton */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div 
            key={i} 
            className="w-full rounded-xl bg-white/5 break-inside-avoid"
            style={{ height: `${(i % 3 + 1) * 50 + 150}px` }}
          />
        ))}
      </div>
    </div>
  )
}
