export interface Genre {
  id: number
  name: string
}

/** `GET /genre/movie/list` */
export type GetGenresResponse = Genre[]
