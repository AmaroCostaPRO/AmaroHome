import { PageWrapper } from "@/components/layout/page-wrapper"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <PageWrapper className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 bg-slate-800/50" />
          <Skeleton className="h-4 w-64 bg-slate-800/50" />
        </div>
      </div>

      {/* Upload Zone Skeleton */}
      <Skeleton className="w-full h-32 rounded-3xl bg-slate-800/50" />

      {/* Books Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="space-y-3">
            <div key={i} className="aspect-2/3 rounded-xl bg-slate-800/50" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4 bg-slate-800/50" />
              <Skeleton className="h-3 w-1/2 bg-slate-800/50" />
            </div>
          </div>
        ))}
      </div>
    </PageWrapper>
  )
}
