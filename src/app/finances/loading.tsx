export default function FinancesLoading() {
  return (
    <div className="space-y-8 max-w-5xl animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-32 bg-white/5 rounded-md" />
          <div className="h-4 w-48 bg-white/5 rounded-md" />
        </div>
        
        {/* Date Selector Skeleton */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-white/5 rounded-sm" />
          <div className="w-[140px] h-5 bg-white/5 rounded-md" />
          <div className="w-9 h-9 bg-white/5 rounded-sm" />
        </div>
      </div>

      {/* Summary Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 rounded-xl bg-white/5" />
        ))}
      </div>

      {/* New Transaction Button Skeleton */}
      <div className="flex justify-end">
        <div className="h-10 w-40 bg-white/5 rounded-md" />
      </div>

      {/* Transactions List Skeleton */}
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-20 w-full rounded-lg bg-white/5" />
        ))}
      </div>
    </div>
  )
}
