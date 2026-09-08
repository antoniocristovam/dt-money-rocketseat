import type { MovieListItem } from './movie-list-item'
import type { Paginated } from './paginated'

export type GetMoviesResponse = Paginated<MovieListItem>
