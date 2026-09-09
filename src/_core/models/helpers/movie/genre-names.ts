import type { Genre } from '@/_core/models/responses/movie'

export function genreNames(
  genreIds: number[],
  genres: Genre[],
  limit = Infinity,
): string[] {
  const byId = new Map(genres.map((genre) => [genre.id, genre.name]))
  return genreIds
    .map((id) => byId.get(id))
    .filter((name): name is string => Boolean(name))
    .slice(0, limit)
}
