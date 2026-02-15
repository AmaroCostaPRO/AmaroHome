import { cn } from '@/lib/utils'

interface PageWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

export function PageWrapper({ children, className, ...props }: PageWrapperProps) {
  return (
    <div
      className={cn(
        'w-full max-w-[1600px] mx-auto p-6 md:p-8 lg:p-12',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
