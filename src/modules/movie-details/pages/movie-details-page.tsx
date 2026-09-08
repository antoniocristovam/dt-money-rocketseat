import { Link } from '@tanstack/react-router'
import { ArrowLeftIcon, TriangleAlertIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { HttpError } from '@/shared/api/http-error'
import { Button } from '@/shared/ui/button'

import { useMovieDetailsQuery } from '../model/use-movie-details-query'
import { MovieDetailsSkeleton } from '../ui/movie-details-skeleton'
import { MovieDetailsView } from '../ui/movie-details-view'

interface MovieDetailsPageProps {
  movieId: string
}

export const MovieDetailsPage = ({ movieId }: MovieDetailsPageProps) => {
  const id = Number(movieId)
  const query = useMovieDetailsQuery(id)

  const notFound =
    !Number.isFinite(id) ||
    id <= 0 ||
    (query.error instanceof HttpError && query.error.status === 404)

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm">
        <Link to="/">
          <ArrowLeftIcon className="size-4" />
          Voltar para a descoberta
        </Link>
      </Button>

      {notFound ? (
        <EmptyState
          title="Filme não encontrado"
          description="O identificador informado não corresponde a nenhum filme."
        />
      ) : query.isLoading ? (
        <MovieDetailsSkeleton />
      ) : query.isError ? (
        <EmptyState
          title="Não foi possível carregar o filme"
          description="Tente novamente em instantes."
          action={
            <Button onClick={() => void query.refetch()}>
              Tentar novamente
            </Button>
          }
        />
      ) : query.data ? (
        <MovieDetailsView movie={query.data} />
      ) : null}
    </div>
  )
}

function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed py-16 text-center">
      <TriangleAlertIcon className="size-8 text-muted-foreground" />
      <div className="space-y-1">
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  )
}
