import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { TmdbMovieDto } from '@/_core/models/dtos/movie'
import { httpClient } from '@/shared/api/http-client'

import { MovieService } from './movie.service'

vi.mock('@/shared/api/http-client', () => ({ httpClient: vi.fn() }))

const mockedHttp = vi.mocked(httpClient)
const service = new MovieService()

function moviePage(results: Partial<TmdbMovieDto>[]) {
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

describe('MovieService.getMovies', () => {
  it('calls /discover/movie with mapped filter params when there is no text query', async () => {
    mockedHttp.mockResolvedValue(moviePage([]))

    await service.getMovies({ page: 2, genreId: 28, year: 1999, minRating: 8 })

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

  it('calls /search/movie when there is a text query', async () => {
    mockedHttp.mockResolvedValue(moviePage([]))

    await service.getMovies({ page: 1, query: 'matrix' })

    expect(mockedHttp).toHaveBeenCalledWith(
      '/search/movie',
      expect.objectContaining({
        params: expect.objectContaining({ query: 'matrix', page: 1 }),
      }),
    )
  })

  it('applies genre and rating client-side to search results', async () => {
    mockedHttp.mockResolvedValue(
      moviePage([
        { genre_ids: [28], vote_average: 9 },
        { genre_ids: [35], vote_average: 9 },
        { genre_ids: [28], vote_average: 4 },
      ]),
    )

    const result = await service.getMovies({
      page: 1,
      query: 'x',
      genreId: 28,
      minRating: 7,
    })

    expect(result.results).toHaveLength(1)
    expect(result.results[0]?.rating).toBe(9)
  })
})

describe('MovieService.getMovieDetails', () => {
  it('requests the movie with credits + videos appended and returns the domain model', async () => {
    mockedHttp.mockResolvedValue({
      ...moviePage([{}]).results[0],
      title: 'Duna',
      tagline: '',
      runtime: 155,
      genres: [{ id: 878, name: 'Ficção' }],
    })

    const details = await service.getMovieDetails({ id: 693134 })

    expect(mockedHttp).toHaveBeenCalledWith('/movie/693134', {
      params: { append_to_response: 'credits,videos' },
    })
    expect(details.title).toBe('Duna')
    expect(details.genreIds).toEqual([878])
  })
})

describe('MovieService.getGenres', () => {
  it('unwraps the `genres` array from the TMDB payload', async () => {
    mockedHttp.mockResolvedValue({ genres: [{ id: 1, name: 'Ação' }] })

    await expect(service.getGenres()).resolves.toEqual([
      { id: 1, name: 'Ação' },
    ])
    expect(mockedHttp).toHaveBeenCalledWith('/genre/movie/list')
  })
})
