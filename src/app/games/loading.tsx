export default function GamesLoading() {
  return (
    <div className="space-y-8 max-w-6xl animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-40 bg-white/5 rounded-md" />
          <div className="h-4 w-60 bg-white/5 rounded-md" />
        </div>
        <div className="h-10 w-32 bg-white/5 rounded-md" />
      </div>

      {/* Tabs Skeleton */}
      <div className="flex gap-1 p-1 w-fit mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-28 h-10 bg-white/5 rounded-md" />
        ))}
      </div>

      {/* Games Grid Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="aspect-3/4 rounded-xl bg-white/5" />
        ))}
      </div>
    </div>
  )
}
