import { PageWrapper } from "@/components/layout/page-wrapper"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <PageWrapper className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 bg-slate-800/50" />
          <Skeleton className="h-4 w-64 bg-slate-800/50" />
        </div>
        <Skeleton className="h-10 w-32 rounded-full bg-slate-800/50" />
      </div>

      {/* Stats/Tabs Skeleton */}
      <div className="flex gap-4">
        <Skeleton className="h-10 w-24 rounded-full bg-slate-800/50" />
        <Skeleton className="h-10 w-24 rounded-full bg-slate-800/50" />
        <Skeleton className="h-10 w-24 rounded-full bg-slate-800/50" />
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-3/4 w-full rounded-2xl bg-slate-800/50" />
            <Skeleton className="h-4 w-3/4 bg-slate-800/50" />
          </div>
        ))}
      </div>
    </PageWrapper>
  )
}
