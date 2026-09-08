export interface TmdbMovieDto {
  id: number
  title: string
  overview: string
  vote_count: number
  genre_ids?: number[]
  release_date: string
  vote_average: number
  poster_path: string | null
  backdrop_path: string | null
}

export interface TmdbPaginatedDto<T> {
  results: T[]
  page: number
  total_pages: number
  total_results: number
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
  order: number
  character: string
  profile_path: string | null
}

export interface TmdbMovieDetailsDto extends TmdbMovieDto {
  tagline: string | null
  runtime: number | null
  videos?: { results: TmdbVideoDto[] }
  credits?: { cast: TmdbCastMemberDto[] }
  genres: Array<{ id: number; name: string }>
}
