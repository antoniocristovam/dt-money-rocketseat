import type { Genre } from './get-genres-response'
import type { MovieListItem } from './get-movies-response'

export interface CastMember {
  id: number
  name: string
  character: string
  profilePath: string | null
}

export interface MovieDetails extends MovieListItem {
  genres: Genre[]
  cast: CastMember[]
  tagline: string | null
  runtime: number | null
  trailerKey: string | null
}

export type GetMovieDetailsResponse = MovieDetails
