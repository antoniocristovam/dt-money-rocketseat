import { BookmarkCheckIcon, BookmarkPlusIcon } from 'lucide-react'
import type { MouseEvent } from 'react'

import type { MovieListItem } from '@/_core/models/responses/movie'
import { useIsInWatchlist, useWatchlistActions } from '@/features/watchlist'
import { cn } from '@/shared/lib/cn'
import { notify } from '@/shared/lib/notify'
import { Button } from '@/shared/ui/button'

interface WatchlistToggleButtonProps {
  movie: MovieListItem
  variant?: 'default' | 'icon'
  className?: string
}

export function WatchlistToggleButton({
  movie,
  className,
  variant = 'default',
}: WatchlistToggleButtonProps) {
  const inList = useIsInWatchlist(movie.id)
  const { toggle } = useWatchlistActions()

  const handleClick = (event: MouseEvent) => {
    // Cards wrap this button in a <Link>; don't navigate on toggle.
    event.preventDefault()
    event.stopPropagation()
    const added = toggle(movie)
    notify.success(
      added
        ? `"${movie.title}" adicionado à sua lista`
        : `"${movie.title}" removido`,
    )
  }

  const label = inList ? 'Na minha lista' : 'Adicionar à lista'
  const Icon = inList ? BookmarkCheckIcon : BookmarkPlusIcon

  if (variant === 'icon') {
    return (
      <Button
        type="button"
        size="icon-sm"
        aria-label={label}
        onClick={handleClick}
        aria-pressed={inList}
        className={className}
        variant={inList ? 'default' : 'secondary'}
      >
        <Icon className="size-4" />
      </Button>
    )
  }

  return (
    <Button
      type="button"
      onClick={handleClick}
      aria-pressed={inList}
      className={cn(className)}
      variant={inList ? 'default' : 'outline'}
    >
      <Icon className="size-4" />
      {label}
    </Button>
  )
}
