import type { Genre } from './genre'
import type { MovieListItem } from './movie-list-item'

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
