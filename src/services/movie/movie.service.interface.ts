import type {
  GetMovieDetailsParams,
  GetMoviesParams,
} from '@/_core/models/params/movie'
import type {
  GetGenresResponse,
  GetMovieDetailsResponse,
  GetMoviesResponse,
} from '@/_core/models/responses/movie'

export interface IMovieService {
  getMovies(params: GetMoviesParams): Promise<GetMoviesResponse>

  getMovieDetails(
    params: GetMovieDetailsParams,
  ): Promise<GetMovieDetailsResponse>

  getGenres(): Promise<GetGenresResponse>
}
