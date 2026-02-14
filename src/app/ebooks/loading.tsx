export default function EbooksLoading() {
  return (
    <div className="space-y-8 max-w-7xl animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-white/5 rounded-md" />
          <div className="h-4 w-40 bg-white/5 rounded-md" />
        </div>
        <div className="h-10 w-10 bg-white/5 rounded-md" />
      </div>

      {/* Upload Zone Skeleton */}
      <div className="h-32 w-full bg-white/5 rounded-xl border border-dashed border-white/10" />

      {/* Books Grid Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
          <div key={i} className="aspect-2/3 rounded-lg bg-white/5" />
        ))}
      </div>
    </div>
  )
}
