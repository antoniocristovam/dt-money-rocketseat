import { BookmarkCheckIcon, BookmarkPlusIcon } from 'lucide-react'
import type { MouseEvent } from 'react'
import { toast } from 'sonner'

import type { MovieListItem } from '@/entities/movie'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui/button'

import { useIsInWatchlist, useWatchlistActions } from '../model/use-watchlist'

interface WatchlistToggleButtonProps {
  movie: MovieListItem
  variant?: 'default' | 'icon'
  className?: string
}

export function WatchlistToggleButton({
  movie,
  variant = 'default',
  className,
}: WatchlistToggleButtonProps) {
  const inList = useIsInWatchlist(movie.id)
  const { toggle } = useWatchlistActions()

  const handleClick = (event: MouseEvent) => {
    // Cards wrap this button in a <Link>; don't navigate on toggle.
    event.preventDefault()
    event.stopPropagation()
    const added = toggle(movie)
    toast.success(
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
        variant={inList ? 'default' : 'secondary'}
        onClick={handleClick}
        aria-pressed={inList}
        aria-label={label}
        className={className}
      >
        <Icon className="size-4" />
      </Button>
    )
  }

  return (
    <Button
      type="button"
      variant={inList ? 'default' : 'outline'}
      onClick={handleClick}
      aria-pressed={inList}
      className={cn(className)}
    >
      <Icon className="size-4" />
      {label}
    </Button>
  )
}
