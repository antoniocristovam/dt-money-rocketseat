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
      className="group flex flex-col overflow-hidden rounded-xl border bg-card transition-all duration-200 hover:-translate-y-1 hover:border-foreground/20 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <TmdbImage
        path={movie.posterPath}
        size="w342"
        alt={`Pôster de ${movie.title}`}
        className="aspect-[2/3]"
        imgClassName="transition-transform duration-500 group-hover:scale-105"
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
        <RatingBadge
          value={movie.rating}
          iconClassName="size-3"
          className="absolute left-2 top-2 rounded-full bg-black/65 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur-sm"
        />
        <WatchlistToggleButton
          movie={movie}
          variant="icon"
          className="absolute right-2 top-2 opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100"
        />
      </TmdbImage>

      <div className="flex flex-col gap-0.5 p-3">
        <h3 className="line-clamp-1 text-sm font-medium transition-colors group-hover:text-primary">
          {movie.title}
        </h3>
        <p className="text-xs text-muted-foreground">
          {[movie.year, primaryGenre].filter(Boolean).join(' · ') || '—'}
        </p>
      </div>
    </Link>
  )
}
