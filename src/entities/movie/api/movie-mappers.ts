import type { MovieListItem, Paginated } from '../model/types'

import type { TmdbMovieDto, TmdbPaginatedDto } from './tmdb-dto'

function parseYear(releaseDate: string): number | null {
  const year = Number.parseInt(releaseDate.slice(0, 4), 10)
  return Number.isNaN(year) ? null : year
}

export function mapMovieListItem(dto: TmdbMovieDto): MovieListItem {
  return {
    id: dto.id,
    title: dto.title,
    overview: dto.overview,
    posterPath: dto.poster_path,
    backdropPath: dto.backdrop_path,
    releaseDate: dto.release_date || null,
    year: dto.release_date ? parseYear(dto.release_date) : null,
    rating: dto.vote_average,
    voteCount: dto.vote_count,
    genreIds: dto.genre_ids ?? [],
  }
}

export function mapPaginated(
  dto: TmdbPaginatedDto<TmdbMovieDto>,
): Paginated<MovieListItem> {
  return {
    page: dto.page,
    // TMDB caps navigable pages at 500 regardless of the reported total.
    totalPages: Math.min(dto.total_pages, 500),
    totalResults: dto.total_results,
    results: dto.results.map(mapMovieListItem),
  }
}
