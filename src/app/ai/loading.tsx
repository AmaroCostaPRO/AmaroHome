import { PageWrapper } from "@/components/layout/page-wrapper"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <PageWrapper className="flex flex-col h-[calc(100vh-6rem)] max-w-4xl mx-auto space-y-4">
      {/* Header Skeleton */}
      <div className="shrink-0 mb-4 space-y-2">
        <Skeleton className="h-8 w-48 bg-slate-800/50" />
        <Skeleton className="h-4 w-64 bg-slate-800/50" />
      </div>

      {/* Messages Area Skeleton */}
      <div className="flex-1 space-y-6 overflow-hidden">
        {/* User Message */}
        <div className="flex justify-end">
          <Skeleton className="h-12 w-2/3 rounded-2xl rounded-tr-sm bg-slate-800/50" />
        </div>
        
        {/* AI Message */}
        <div className="flex justify-start">
          <Skeleton className="h-24 w-3/4 rounded-2xl rounded-tl-sm bg-slate-800/50" />
        </div>

         {/* User Message */}
         <div className="flex justify-end">
          <Skeleton className="h-10 w-1/2 rounded-2xl rounded-tr-sm bg-slate-800/50" />
        </div>
      </div>

      {/* Input Skeleton */}
      <Skeleton className="h-14 w-full rounded-2xl bg-slate-800/50" />
    </PageWrapper>
  )
}
