import { httpClient } from '@/shared/api/http-client'

import type { MovieDetails } from '../model/types'

import { mapMovieDetails } from './movie-mappers'
import type { TmdbMovieDetailsDto } from './tmdb-dto'

export async function fetchMovieDetails(id: number): Promise<MovieDetails> {
  const dto = await httpClient<TmdbMovieDetailsDto>(`/movie/${id}`, {
    params: { append_to_response: 'credits,videos' },
  })
  return mapMovieDetails(dto)
}
