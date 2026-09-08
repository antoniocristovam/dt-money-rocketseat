import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'

import type { GetMoviesParams } from '@/_core/models/params/movie'
import type { GetMoviesResponse } from '@/_core/models/responses/movie'
import { movieService } from '@/services/movie'
import { queryKeys } from '@/shared/api/query-keys'

export function useMovies(params: GetMoviesParams) {
  const requestMovies = useCallback(
    (): Promise<GetMoviesResponse> => movieService.getMovies(params),
    [params],
  )

  return useQuery({
    staleTime: 60_000,
    queryFn: requestMovies,
    placeholderData: keepPreviousData,
    queryKey: queryKeys.movies.list({ ...params }),
  })
}
