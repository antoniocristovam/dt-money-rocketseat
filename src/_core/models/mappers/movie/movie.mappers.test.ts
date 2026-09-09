import { describe, expect, it } from 'vitest'

import type {
  TmdbMovieDetailsDto,
  TmdbMovieDto,
} from '@/_core/models/dtos/movie'

import {
  mapMovieDetails,
  mapMovieListItem,
  mapPaginated,
} from './movie.mappers'

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
  it('mapeia o DTO snake_case para o formato de domínio', () => {
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

  it('lida com data de lançamento e genre ids ausentes', () => {
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
  it('limita totalPages ao teto de 500 páginas do TMDB', () => {
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

const detailsDto: TmdbMovieDetailsDto = {
  ...dto,
  genre_ids: undefined,
  tagline: 'A guerra pela especiaria.',
  runtime: 155,
  genres: [
    { id: 878, name: 'Ficção Científica' },
    { id: 12, name: 'Aventura' },
  ],
  credits: {
    cast: Array.from({ length: 20 }, (_, index) => ({
      id: index,
      name: `Ator ${index}`,
      character: `Personagem ${index}`,
      profile_path: null,
      order: index,
    })),
  },
  videos: {
    results: [
      { key: 'teaser1', site: 'YouTube', type: 'Teaser', official: true },
      {
        key: 'trailer-unofficial',
        site: 'YouTube',
        type: 'Trailer',
        official: false,
      },
      {
        key: 'trailer-official',
        site: 'YouTube',
        type: 'Trailer',
        official: true,
      },
      { key: 'vimeo1', site: 'Vimeo', type: 'Trailer', official: true },
    ],
  },
}

describe('mapMovieDetails', () => {
  it('deriva genreIds dos objetos de gênero e mapeia os campos extras', () => {
    const mapped = mapMovieDetails(detailsDto)
    expect(mapped.genreIds).toEqual([878, 12])
    expect(mapped.tagline).toBe('A guerra pela especiaria.')
    expect(mapped.runtime).toBe(155)
    expect(mapped.genres).toHaveLength(2)
  })

  it('limita o elenco a 12 pessoas', () => {
    expect(mapMovieDetails(detailsDto).cast).toHaveLength(12)
  })

  it('prioriza o trailer oficial do YouTube', () => {
    expect(mapMovieDetails(detailsDto).trailerKey).toBe('trailer-official')
  })

  it('retorna trailer null quando não há vídeo do YouTube', () => {
    const mapped = mapMovieDetails({ ...detailsDto, videos: { results: [] } })
    expect(mapped.trailerKey).toBeNull()
  })
})
