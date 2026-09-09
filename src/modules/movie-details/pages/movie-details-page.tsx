import { Link } from '@tanstack/react-router'
import { ArrowLeftIcon, TriangleAlertIcon } from 'lucide-react'

import { HttpError } from '@/shared/api/http-error'
import { EmptyState } from '@/shared/components/empty-state'
import { Button } from '@/shared/ui/button'

import { MovieDetailsSkeleton } from '../components/movie-details-skeleton'
import { MovieDetailsView } from '../components/movie-details-view'
import { useMovieDetails } from '../hooks/use-movie-details'

interface MovieDetailsPageProps {
  movieId: string
}

export const MovieDetailsPage = ({ movieId }: MovieDetailsPageProps) => {
  const id = Number(movieId)
  const query = useMovieDetails(id)

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
          icon={<TriangleAlertIcon />}
          title="Filme não encontrado"
          description="O identificador informado não corresponde a nenhum filme."
        />
      ) : query.isLoading ? (
        <MovieDetailsSkeleton />
      ) : query.isError ? (
        <EmptyState
          icon={<TriangleAlertIcon />}
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
