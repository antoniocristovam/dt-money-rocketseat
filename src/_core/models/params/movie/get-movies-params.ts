export interface GetMoviesParams {
  page: number
  /** Free-text search; when present the genre/rating filters are best-effort. */
  query?: string
  genreId?: number
  year?: number
  minRating?: number
}
