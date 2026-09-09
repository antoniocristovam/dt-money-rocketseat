export interface MovieListItem {
  id: number
  title: string
  rating: number
  overview: string
  voteCount: number
  genreIds: number[]
  year: number | null
  posterPath: string | null
  releaseDate: string | null
  backdropPath: string | null
}

export interface Paginated<T> {
  page: number
  results: T[]
  totalPages: number
  totalResults: number
}

export type GetMoviesResponse = Paginated<MovieListItem>
