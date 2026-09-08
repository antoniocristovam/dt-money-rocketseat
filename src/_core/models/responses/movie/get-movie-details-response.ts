import type { Genre } from './get-genres-response'
import type { MovieListItem } from './get-movies-response'

export interface CastMember {
  id: number
  name: string
  character: string
  profilePath: string | null
}

/** Full movie payload for the details page. Superset of {@link MovieListItem}. */
export interface MovieDetails extends MovieListItem {
  tagline: string | null
  runtime: number | null
  genres: Genre[]
  cast: CastMember[]
  /** YouTube key of the best trailer, or `null` when there is none. */
  trailerKey: string | null
}

/** `GET /movie/{id}?append_to_response=credits,videos` */
export type GetMovieDetailsResponse = MovieDetails
