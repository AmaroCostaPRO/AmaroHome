import { PageWrapper } from "@/components/layout/page-wrapper"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <PageWrapper className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 bg-slate-800/50" />
          <Skeleton className="h-4 w-96 bg-slate-800/50" />
        </div>
        <Skeleton className="h-10 w-32 rounded-full bg-slate-800/50" />
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-video w-full rounded-2xl bg-slate-800/50" />
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
