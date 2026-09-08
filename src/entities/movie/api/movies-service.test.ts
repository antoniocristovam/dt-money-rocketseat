import { beforeEach, describe, expect, it, vi } from 'vitest'

import { httpClient } from '@/shared/api/http-client'

import { fetchMovies } from './movies-service'
import type { TmdbMovieDto } from './tmdb-dto'

vi.mock('@/shared/api/http-client', () => ({ httpClient: vi.fn() }))

const mockedHttp = vi.mocked(httpClient)

function dtoPage(results: Partial<TmdbMovieDto>[]) {
  return {
    page: 1,
    total_pages: 1,
    total_results: results.length,
    results: results.map((partial, index) => ({
      id: index + 1,
      title: `Movie ${index + 1}`,
      overview: '',
      poster_path: null,
      backdrop_path: null,
      release_date: '2020-01-01',
      vote_average: 5,
      vote_count: 100,
      genre_ids: [],
      ...partial,
    })),
  }
}

beforeEach(() => {
  mockedHttp.mockReset()
})

describe('fetchMovies', () => {
  it('hits /discover/movie with mapped filter params when there is no text query', async () => {
    mockedHttp.mockResolvedValue(dtoPage([]))

    await fetchMovies({ page: 2, genreId: 28, year: 1999, minRating: 8 })

    expect(mockedHttp).toHaveBeenCalledWith('/discover/movie', {
      params: expect.objectContaining({
        page: 2,
        with_genres: 28,
        primary_release_year: 1999,
        'vote_average.gte': 8,
        sort_by: 'popularity.desc',
      }),
    })
  })

  it('hits /search/movie when there is a text query', async () => {
    mockedHttp.mockResolvedValue(dtoPage([]))

    await fetchMovies({ page: 1, query: 'matrix' })

    expect(mockedHttp).toHaveBeenCalledWith(
      '/search/movie',
      expect.objectContaining({
        params: expect.objectContaining({ query: 'matrix', page: 1 }),
      }),
    )
  })

  it('applies genre and rating client-side to search results', async () => {
    mockedHttp.mockResolvedValue(
      dtoPage([
        { genre_ids: [28], vote_average: 9 },
        { genre_ids: [35], vote_average: 9 },
        { genre_ids: [28], vote_average: 4 },
      ]),
    )

    const result = await fetchMovies({
      page: 1,
      query: 'x',
      genreId: 28,
      minRating: 7,
    })

    expect(result.results).toHaveLength(1)
    expect(result.results[0]?.rating).toBe(9)
  })
})
