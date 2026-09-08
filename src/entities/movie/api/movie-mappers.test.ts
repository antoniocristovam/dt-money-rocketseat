import { describe, expect, it } from 'vitest'

import { mapMovieListItem, mapPaginated } from './movie-mappers'
import type { TmdbMovieDto } from './tmdb-dto'

const dto: TmdbMovieDto = {
  id: 1,
  title: 'Duna',
  overview: 'Areia.',
  poster_path: '/poster.jpg',
  backdrop_path: null,
  release_date: '2021-09-15',
  vote_average: 7.8,
  vote_count: 1000,
  genre_ids: [878, 12],
}

describe('mapMovieListItem', () => {
  it('maps snake_case DTO to the domain shape', () => {
    expect(mapMovieListItem(dto)).toEqual({
      id: 1,
      title: 'Duna',
      overview: 'Areia.',
      posterPath: '/poster.jpg',
      backdropPath: null,
      releaseDate: '2021-09-15',
      year: 2021,
      rating: 7.8,
      voteCount: 1000,
      genreIds: [878, 12],
    })
  })

  it('handles a missing release date and genre ids', () => {
    const mapped = mapMovieListItem({
      ...dto,
      release_date: '',
      genre_ids: undefined,
    })
    expect(mapped.releaseDate).toBeNull()
    expect(mapped.year).toBeNull()
    expect(mapped.genreIds).toEqual([])
  })
})

describe('mapPaginated', () => {
  it('caps totalPages at TMDB’s 500-page limit', () => {
    const mapped = mapPaginated({
      page: 1,
      total_pages: 58817,
      total_results: 1_176_340,
      results: [dto],
    })
    expect(mapped.totalPages).toBe(500)
    expect(mapped.results).toHaveLength(1)
    expect(mapped.results[0]?.title).toBe('Duna')
  })
})
