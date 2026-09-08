import { createFileRoute } from '@tanstack/react-router'

import { MovieDetailsPage } from '@/modules/movie-details/pages/movie-details-page'

export const Route = createFileRoute('/_authenticated/movie/$movieId')({
  component: MovieDetailsRoute,
})

function MovieDetailsRoute() {
  const { movieId } = Route.useParams()
  return <MovieDetailsPage movieId={movieId} />
}
