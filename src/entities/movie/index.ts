export type {
  Genre,
  CastMember,
  MovieListItem,
  MovieDetails,
  Paginated,
} from './model/types'
export { posterUrl, backdropUrl } from './model/poster'
export type { PosterSize, BackdropSize } from './model/poster'
export { genreNames } from './model/genres'
export { useGenresQuery, useGenres } from './model/use-genres-query'

export { fetchMovies } from './api/movies-service'
export type { MovieQuery } from './api/movies-service'
export { fetchMovieGenres } from './api/genres-service'
export { fetchMovieDetails } from './api/movie-details-service'
export {
  mapMovieListItem,
  mapMovieDetails,
  mapPaginated,
} from './api/movie-mappers'
