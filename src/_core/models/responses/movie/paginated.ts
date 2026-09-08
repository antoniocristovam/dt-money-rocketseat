/** Generic shape of a TMDB paginated list, mapped to the domain. */
export interface Paginated<T> {
  page: number
  totalPages: number
  totalResults: number
  results: T[]
}
