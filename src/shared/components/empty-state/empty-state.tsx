import type { ReactNode } from 'react'

import { cn } from '@/shared/lib/cn'

interface EmptyStateProps {
  title: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
  /** Dashed border box for an inline empty state. Turn off for full-page use. */
  bordered?: boolean
  className?: string
}

/**
 * Centered "nothing here / something went wrong" block: optional icon, a title,
 * an optional description and an optional action (retry button, link…).
 */
export function EmptyState({
  title,
  description,
  icon,
  action,
  bordered = true,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-3 text-center',
        bordered && 'rounded-lg border border-dashed py-16',
        className,
      )}
    >
      {icon ? (
        <div className="text-muted-foreground [&_svg]:size-8">{icon}</div>
      ) : null}
      <div className="space-y-1">
        <p className="font-medium">{title}</p>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  )
}
