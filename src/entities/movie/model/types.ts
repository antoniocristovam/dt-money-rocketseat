export interface Genre {
  id: number
  name: string
}

/** A movie as shown in listings (discovery grid, watchlist). */
export interface MovieListItem {
  id: number
  title: string
  overview: string
  posterPath: string | null
  backdropPath: string | null
  releaseDate: string | null
  /** Year parsed from `releaseDate`, or `null` when unknown. */
  year: number | null
  /** TMDB `vote_average`, 0–10. */
  rating: number
  voteCount: number
  genreIds: number[]
}

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

/** Generic shape of a TMDB paginated list, mapped to the domain. */
export interface Paginated<T> {
  page: number
  totalPages: number
  totalResults: number
  results: T[]
}
