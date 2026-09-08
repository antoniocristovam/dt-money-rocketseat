import { Link } from '@tanstack/react-router'
import { ImageIcon, StarIcon } from 'lucide-react'

import { genreNames } from '@/_core/models/helpers/movie'
import type { Genre, MovieListItem } from '@/_core/models/responses/movie'
import { posterUrl } from '@/shared/lib/tmdb-image'
import { WatchlistToggleButton } from '@/widgets/watchlist-toggle-button'

interface MovieCardProps {
  movie: MovieListItem
  genres: Genre[]
}

export function MovieCard({ movie, genres }: MovieCardProps) {
  const poster = posterUrl(movie.posterPath, 'w342')
  const [primaryGenre] = genreNames(movie.genreIds, genres, 1)

  return (
    <Link
      to="/movie/$movieId"
      params={{ movieId: String(movie.id) }}
      className="group flex flex-col overflow-hidden rounded-lg border bg-card transition-colors hover:border-primary/50"
    >
      <div className="relative aspect-[2/3] bg-muted">
        {poster ? (
          <img
            src={poster}
            alt={`Pôster de ${movie.title}`}
            loading="lazy"
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground">
            <ImageIcon className="size-8" />
          </div>
        )}
        <span className="absolute left-2 top-2 flex items-center gap-1 rounded-md bg-background/90 px-1.5 py-0.5 text-xs font-medium">
          <StarIcon className="size-3 fill-amber-400 text-amber-400" />
          {movie.rating.toFixed(1)}
        </span>
        <WatchlistToggleButton
          movie={movie}
          variant="icon"
          className="absolute right-2 top-2 opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100"
        />
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="line-clamp-2 text-sm font-medium group-hover:text-primary">
          {movie.title}
        </h3>
        <p className="mt-auto text-xs text-muted-foreground">
          {[movie.year, primaryGenre].filter(Boolean).join(' · ') || '—'}
        </p>
      </div>
    </Link>
  )
}
