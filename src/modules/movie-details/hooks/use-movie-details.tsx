import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'

import type { GetMovieDetailsResponse } from '@/_core/models/responses/movie'
import { movieService } from '@/services/movie'
import { HttpError } from '@/shared/api/http-error'
import { queryKeys } from '@/shared/api/query-keys'

export function useMovieDetails(id: number) {
  const requestMovieDetails = useCallback(
    (): Promise<GetMovieDetailsResponse> =>
      movieService.getMovieDetails({ id }),
    [id],
  )

  return useQuery({
    queryKey: queryKeys.movies.detail(id),
    queryFn: requestMovieDetails,
    enabled: Number.isFinite(id) && id > 0,
    staleTime: 5 * 60_000,
    retry: (failureCount, error) => {
      if (error instanceof HttpError && error.status === 404) return false
      return failureCount < 1
    },
  })
}
