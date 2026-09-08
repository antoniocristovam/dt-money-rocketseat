import { FilmIcon, TriangleAlertIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import type { Genre, MovieListItem } from '@/entities/movie'
import { Button } from '@/shared/ui/button'
import { Skeleton } from '@/shared/ui/skeleton'

import { MovieCard } from './movie-card'

const GRID =
  'grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'

interface MovieGridProps {
  movies: MovieListItem[]
  genres: Genre[]
  isLoading: boolean
  isError: boolean
  onRetry: () => void
}

export function MovieGrid({
  movies,
  genres,
  isLoading,
  isError,
  onRetry,
}: MovieGridProps) {
  if (isLoading) {
    return (
      <div className={GRID} aria-busy="true" aria-label="Carregando filmes">
        {Array.from({ length: 10 }, (_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="aspect-[2/3] w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <EmptyState
        icon={<TriangleAlertIcon className="size-8" />}
        title="Não foi possível carregar os filmes"
        description="Verifique sua conexão e tente novamente."
        action={<Button onClick={onRetry}>Tentar novamente</Button>}
      />
    )
  }

  if (movies.length === 0) {
    return (
      <EmptyState
        icon={<FilmIcon className="size-8" />}
        title="Nenhum filme encontrado"
        description="Ajuste os filtros ou o termo de busca."
      />
    )
  }

  return (
    <div className={GRID}>
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} genres={genres} />
      ))}
    </div>
  )
}

function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed py-16 text-center">
      <div className="text-muted-foreground">{icon}</div>
      <div className="space-y-1">
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  )
}
