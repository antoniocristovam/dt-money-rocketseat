import type {
  TmdbMovieDetailsDto,
  TmdbMovieDto,
  TmdbPaginatedDto,
  TmdbVideoDto,
} from '@/_core/models/dtos/movie'
import type {
  MovieDetails,
  MovieListItem,
  Paginated,
} from '@/_core/models/responses/movie'

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

/** Picks the best trailer: an official YouTube "Trailer", else any YouTube video. */
function pickTrailerKey(videos: TmdbVideoDto[] = []): string | null {
  const youtube = videos.filter((video) => video.site === 'YouTube')
  const trailer =
    youtube.find((video) => video.type === 'Trailer' && video.official) ??
    youtube.find((video) => video.type === 'Trailer') ??
    youtube[0]
  return trailer?.key ?? null
}

const MAX_CAST = 12

export function mapMovieDetails(dto: TmdbMovieDetailsDto): MovieDetails {
  return {
    ...mapMovieListItem(dto),
    genreIds: dto.genres.map((genre) => genre.id),
    tagline: dto.tagline || null,
    runtime: dto.runtime || null,
    genres: dto.genres,
    cast: (dto.credits?.cast ?? []).slice(0, MAX_CAST).map((member) => ({
      id: member.id,
      name: member.name,
      character: member.character,
      profilePath: member.profile_path,
    })),
    trailerKey: pickTrailerKey(dto.videos?.results),
  }
}
