import { useQuery } from '@tanstack/react-query'

import { fetchMovieDetails } from '@/entities/movie'
import { HttpError } from '@/shared/api/http-error'
import { queryKeys } from '@/shared/api/query-keys'

export function useMovieDetailsQuery(id: number) {
  return useQuery({
    queryKey: queryKeys.movies.detail(id),
    queryFn: () => fetchMovieDetails(id),
    enabled: Number.isFinite(id) && id > 0,
    staleTime: 5 * 60_000,
    retry: (failureCount, error) => {
      // Don't retry a 404 — the movie id is just wrong.
      if (error instanceof HttpError && error.status === 404) return false
      return failureCount < 1
    },
  })
}
