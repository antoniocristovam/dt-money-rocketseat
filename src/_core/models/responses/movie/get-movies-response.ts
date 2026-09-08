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

/** Generic shape of a TMDB paginated list, mapped to the domain. */
export interface Paginated<T> {
  page: number
  totalPages: number
  totalResults: number
  results: T[]
}

/** `GET /discover/movie` and `GET /search/movie` */
export type GetMoviesResponse = Paginated<MovieListItem>
