import { httpClient } from '@/shared/api/http-client'

import type { Genre } from '../model/types'

import type { TmdbGenreListDto } from './tmdb-dto'

export async function fetchMovieGenres(): Promise<Genre[]> {
  const dto = await httpClient<TmdbGenreListDto>('/genre/movie/list')
  return dto.genres
}
