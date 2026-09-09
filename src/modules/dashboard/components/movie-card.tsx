import { Link } from '@tanstack/react-router'

import { genreNames } from '@/_core/models/helpers/movie'
import type { Genre, MovieListItem } from '@/_core/models/responses/movie'
import { RatingBadge } from '@/shared/components/rating-badge'
import { TmdbImage } from '@/shared/components/tmdb-image'
import { WatchlistToggleButton } from '@/widgets/watchlist-toggle-button'

interface MovieCardProps {
  movie: MovieListItem
  genres: Genre[]
}

export function MovieCard({ movie, genres }: MovieCardProps) {
  const [primaryGenre] = genreNames(movie.genreIds, genres, 1)

  return (
    <Link
      to="/movie/$movieId"
      params={{ movieId: String(movie.id) }}
      className="group flex flex-col overflow-hidden rounded-lg border bg-card transition-colors hover:border-primary/50"
    >
      <TmdbImage
        path={movie.posterPath}
        size="w342"
        alt={`Pôster de ${movie.title}`}
        className="aspect-[2/3]"
      >
        <RatingBadge
          value={movie.rating}
          iconClassName="size-3"
          className="absolute left-2 top-2 rounded-md bg-background/90 px-1.5 py-0.5 text-xs font-medium"
        />
        <WatchlistToggleButton
          movie={movie}
          variant="icon"
          className="absolute right-2 top-2 opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100"
        />
      </TmdbImage>

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
