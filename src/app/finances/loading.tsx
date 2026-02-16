import { PageWrapper } from "@/components/layout/page-wrapper"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <PageWrapper className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Skeleton className="h-8 w-48 bg-slate-800/50" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32 rounded-full bg-slate-800/50" />
          <Skeleton className="h-10 w-32 rounded-full bg-slate-800/50" />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-32 rounded-3xl bg-slate-800/50" />
        <Skeleton className="h-32 rounded-3xl bg-slate-800/50" />
        <Skeleton className="h-32 rounded-3xl bg-slate-800/50" />
      </div>

      {/* Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="col-span-2 h-[400px] rounded-3xl bg-slate-800/50" />
        <Skeleton className="h-[400px] rounded-3xl bg-slate-800/50" />
      </div>

      {/* Recent Transactions */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-48 bg-slate-800/50" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-2xl bg-slate-800/50" />
          ))}
        </div>
      </div>
    </PageWrapper>
  )
}
