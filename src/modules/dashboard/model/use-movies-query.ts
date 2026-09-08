import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { type MovieQuery, fetchMovies } from '@/entities/movie'
import { queryKeys } from '@/shared/api/query-keys'

export function useMoviesQuery(params: MovieQuery) {
  return useQuery({
    queryKey: queryKeys.movies.list({ ...params }),
    queryFn: () => fetchMovies(params),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  })
}
