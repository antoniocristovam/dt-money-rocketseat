import { env } from '@/shared/config/env'

export type PosterSize = 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original'
export type BackdropSize = 'w300' | 'w780' | 'w1280' | 'original'

/** Builds a full TMDB image URL, or `null` when the path is missing. */
export function posterUrl(
  path: string | null,
  size: PosterSize = 'w342',
): string | null {
  if (!path) return null
  return `${env.VITE_TMDB_IMAGE_BASE_URL}/${size}${path}`
}

export function backdropUrl(
  path: string | null,
  size: BackdropSize = 'w1280',
): string | null {
  if (!path) return null
  return `${env.VITE_TMDB_IMAGE_BASE_URL}/${size}${path}`
}
