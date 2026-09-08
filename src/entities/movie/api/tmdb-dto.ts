/** Raw TMDB response shapes — kept separate so the domain never leaks `snake_case`. */

export interface TmdbMovieDto {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  genre_ids?: number[]
}

export interface TmdbPaginatedDto<T> {
  page: number
  total_pages: number
  total_results: number
  results: T[]
}

export interface TmdbGenreListDto {
  genres: Array<{ id: number; name: string }>
}
