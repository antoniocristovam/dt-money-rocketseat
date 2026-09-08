/** Raw TMDB response shapes. The domain never leaks `snake_case` past the mappers. */

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

export interface TmdbVideoDto {
  key: string
  site: string
  type: string
  official: boolean
}

export interface TmdbCastMemberDto {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
}

export interface TmdbMovieDetailsDto extends TmdbMovieDto {
  tagline: string | null
  runtime: number | null
  genres: Array<{ id: number; name: string }>
  credits?: { cast: TmdbCastMemberDto[] }
  videos?: { results: TmdbVideoDto[] }
}
