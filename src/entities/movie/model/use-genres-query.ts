import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'

import { queryKeys } from '@/shared/api/query-keys'

import { fetchMovieGenres } from '../api/genres-service'

import { genreNames } from './genres'
import type { Genre } from './types'

export function useGenresQuery() {
  return useQuery({
    queryKey: queryKeys.genres.list(),
    queryFn: fetchMovieGenres,
    // The genre list is effectively static.
    staleTime: Infinity,
  })
}

/**
 * Convenience hook returning the genre list plus a `resolve` helper that turns
 * genre ids into a display string ("Ação, Aventura").
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

export type { Genre }
