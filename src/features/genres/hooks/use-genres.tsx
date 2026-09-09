import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'

import { genreNames } from '@/_core/models/helpers/movie'
import { movieService } from '@/services/movie'
import { queryKeys } from '@/shared/api/query-keys'

/** Raw query for the TMDB genre list. Effectively static, so it never goes stale. */
export function useGenresQuery() {
  const requestGenres = useCallback(() => movieService.getGenres(), [])

  return useQuery({
    queryKey: queryKeys.genres.list(),
    queryFn: requestGenres,
    staleTime: Infinity,
  })
}

/**
 * The genre list plus a `resolve` helper that turns genre ids into a display
 * string ("Ação, Aventura"). Consumed by the dashboard filters and the watchlist
 * table.
 */
export function useGenres() {
  const { data: genres = [] } = useGenresQuery()

  const resolve = useCallback(
    (genreIds: number[], limit = 2): string =>
      genreNames(genreIds, genres, limit).join(', '),
    [genres],
  )

  return { genres, resolve }
}
