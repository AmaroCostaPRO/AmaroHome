import { PageWrapper } from "@/components/layout/page-wrapper"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <PageWrapper className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-32 bg-slate-800/50" />
          <Skeleton className="h-4 w-48 bg-slate-800/50" />
        </div>
        <Skeleton className="h-10 w-32 rounded-full bg-slate-800/50" />
      </div>

      {/* Masonry Grid Skeleton */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
        {[...Array(8)].map((_, i) => (
          <Skeleton 
            key={i} 
            className="w-full rounded-2xl bg-slate-800/50 break-inside-avoid mb-4"
            style={{ height: `${(i % 3 + 1) * 50 + 100}px` }} 
          />
        ))}
      </div>
    </PageWrapper>
  )
}
