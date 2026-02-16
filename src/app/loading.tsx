import { PageWrapper } from "@/components/layout/page-wrapper"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <PageWrapper className="space-y-8">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
      </div>

      {/* Bento Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[180px]">
        {/* Welcome Widget - Large */}
        <Skeleton className="col-span-1 md:col-span-2 row-span-1 rounded-3xl bg-slate-800/50" />
        
        {/* Simple Widget Cards */}
        <Skeleton className="col-span-1 row-span-1 rounded-3xl bg-slate-800/50" />
        <Skeleton className="col-span-1 row-span-1 rounded-3xl bg-slate-800/50" />
        
        {/* Medium Widgets */}
        <Skeleton className="col-span-1 md:col-span-2 row-span-2 rounded-3xl bg-slate-800/50" />
        <Skeleton className="col-span-1 md:col-span-2 row-span-1 rounded-3xl bg-slate-800/50" />
      </div>
    </PageWrapper>
  )
}
