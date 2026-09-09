import { StarIcon } from 'lucide-react'

import { cn } from '@/shared/lib/cn'

interface RatingBadgeProps {
  value: number
  className?: string
  iconClassName?: string
}

/** Amber star + the score to one decimal. Wrapper styling is up to the caller. */
export function RatingBadge({
  value,
  className,
  iconClassName,
}: RatingBadgeProps) {
  return (
    <span className={cn('inline-flex items-center gap-1', className)}>
      <StarIcon
        className={cn('size-3.5 fill-amber-400 text-amber-400', iconClassName)}
      />
      {value.toFixed(1)}
    </span>
  )
}
