import { httpClient } from '@/shared/api/http-client'

import type { MovieListItem, Paginated } from '../model/types'

import { mapPaginated } from './movie-mappers'
import type { TmdbMovieDto, TmdbPaginatedDto } from './tmdb-dto'

export interface MovieQuery {
  page: number
  query?: string
  genreId?: number
  year?: number
  minRating?: number
}

function isSearch(query: MovieQuery): boolean {
  return Boolean(query.query && query.query.trim())
}

/**
 * TMDB's `/search/movie` ignores genre and rating filters, so when the user is
 * searching by text we apply those two client-side to the returned page.
 */
function applyClientFilters(
  page: Paginated<MovieListItem>,
  { genreId, minRating }: MovieQuery,
): Paginated<MovieListItem> {
  if (genreId === undefined && minRating === undefined) return page
  return {
    ...page,
    results: page.results.filter(
      (movie) =>
        (genreId === undefined || movie.genreIds.includes(genreId)) &&
        (minRating === undefined || movie.rating >= minRating),
    ),
  }
}

export async function fetchMovies(
  query: MovieQuery,
): Promise<Paginated<MovieListItem>> {
  if (isSearch(query)) {
    const dto = await httpClient<TmdbPaginatedDto<TmdbMovieDto>>(
      '/search/movie',
      {
        params: {
          query: query.query,
          page: query.page,
          include_adult: false,
          primary_release_year: query.year,
        },
      },
    )
    return applyClientFilters(mapPaginated(dto), query)
  }

  const dto = await httpClient<TmdbPaginatedDto<TmdbMovieDto>>(
    '/discover/movie',
    {
      params: {
        page: query.page,
        include_adult: false,
        sort_by: 'popularity.desc',
        with_genres: query.genreId,
        primary_release_year: query.year,
        'vote_average.gte': query.minRating,
        'vote_count.gte': query.minRating !== undefined ? 50 : undefined,
      },
    },
  )
  return mapPaginated(dto)
}
