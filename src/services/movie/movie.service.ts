import type {
  TmdbMovieDto,
  TmdbPaginatedDto,
  TmdbGenreListDto,
  TmdbMovieDetailsDto,
} from '@/_core/models/dtos/movie'
import { mapMovieDetails, mapPaginated } from '@/_core/models/mappers/movie'
import type {
  GetMoviesParams,
  GetMovieDetailsParams,
} from '@/_core/models/params/movie'
import type {
  Paginated,
  MovieListItem,
  GetGenresResponse,
  GetMoviesResponse,
  GetMovieDetailsResponse,
} from '@/_core/models/responses/movie'
import { tmdbClient } from '@/shared/api/tmdb-client'

import type { IMovieService } from './movie.service.interface'

function isTextSearch({ query }: GetMoviesParams): boolean {
  return Boolean(query?.trim())
}

function applyClientFilters(
  page: Paginated<MovieListItem>,
  { genreId, minRating }: GetMoviesParams,
): Paginated<MovieListItem> {
  if (genreId === undefined && minRating === undefined) return page
  return {
    ...page,
    results: page.results.filter(
      (movie) =>
        (genreId === undefined || movie.genreIds.includes(genreId)) &&
        (minRating === undefined || movie.rating >= minRating),
    ),
  }
}

export class MovieService implements IMovieService {
  async getMovies(params: GetMoviesParams): Promise<GetMoviesResponse> {
    if (isTextSearch(params)) {
      const { data } = await tmdbClient.get<TmdbPaginatedDto<TmdbMovieDto>>(
        '/search/movie',
        {
          params: {
            query: params.query,
            page: params.page,
            include_adult: false,
            primary_release_year: params.year,
          },
        },
      )
      return applyClientFilters(mapPaginated(data), params)
    }

    const { data } = await tmdbClient.get<TmdbPaginatedDto<TmdbMovieDto>>(
      '/discover/movie',
      {
        params: {
          page: params.page,
          include_adult: false,
          sort_by: 'popularity.desc',
          with_genres: params.genreId,
          primary_release_year: params.year,
          'vote_average.gte': params.minRating,
          'vote_count.gte': params.minRating !== undefined ? 50 : undefined,
        },
      },
    )
    return mapPaginated(data)
  }

  async getMovieDetails({
    id,
  }: GetMovieDetailsParams): Promise<GetMovieDetailsResponse> {
    const { data } = await tmdbClient.get<TmdbMovieDetailsDto>(`/movie/${id}`, {
      params: { append_to_response: 'credits,videos' },
    })
    return mapMovieDetails(data)
  }

  async getGenres(): Promise<GetGenresResponse> {
    const { data } = await tmdbClient.get<TmdbGenreListDto>('/genre/movie/list')
    return data.genres
  }
}

export const movieService: IMovieService = new MovieService()
