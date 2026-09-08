import { Skeleton } from '@/shared/ui/skeleton'

export function MovieDetailsSkeleton() {
  return (
    <div className="space-y-8" aria-busy="true" aria-label="Carregando filme">
      <div className="flex flex-col gap-6 rounded-xl border p-6 sm:flex-row">
        <Skeleton className="aspect-[2/3] w-32 shrink-0 rounded-lg sm:w-44" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-9 w-40" />
        </div>
      </div>
      <Skeleton className="aspect-video w-full rounded-lg" />
    </div>
  )
}
