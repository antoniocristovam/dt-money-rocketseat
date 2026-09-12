import { ImageIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '@/shared/lib/cn'
import { type PosterSize, posterUrl } from '@/shared/lib/tmdb-image'

interface TmdbImageProps {
  path: string | null
  size: PosterSize
  alt: string
  /**
   * Shown when there is no image. `null` leaves just the tinted box; the default
   * is a generic image icon.
   */
  fallback?: ReactNode
  className?: string
  /** Extra classes on the `<img>` itself (e.g. a hover zoom). */
  imgClassName?: string
  loading?: 'lazy' | 'eager'
  /** Overlays positioned against the image box (badges, buttons…). */
  children?: ReactNode
}

const DEFAULT_FALLBACK = <ImageIcon className="size-8" />

/** TMDB poster/profile image with a graceful fallback when the path is missing. */
export function TmdbImage({
  path,
  size,
  alt,
  fallback = DEFAULT_FALLBACK,
  className,
  imgClassName,
  loading = 'lazy',
  children,
}: TmdbImageProps) {
  const src = posterUrl(path, size)

  return (
    <div className={cn('relative overflow-hidden bg-muted', className)}>
      {src ? (
        <img
          src={src}
          alt={alt}
          loading={loading}
          className={cn('size-full object-cover', imgClassName)}
        />
      ) : fallback ? (
        <div className="flex size-full items-center justify-center text-muted-foreground">
          {fallback}
        </div>
      ) : null}
      {children}
    </div>
  )
}
