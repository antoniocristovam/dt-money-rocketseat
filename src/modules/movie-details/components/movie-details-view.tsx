import type { MovieDetails } from '@/_core/models/responses/movie'
import { RatingBadge } from '@/shared/components/rating-badge'
import { TmdbImage } from '@/shared/components/tmdb-image'
import { backdropUrl } from '@/shared/lib/tmdb-image'
import { WatchlistToggleButton } from '@/widgets/watchlist-toggle-button'

import { MovieCast } from './movie-cast'
import { MovieTrailer } from './movie-trailer'

function formatRuntime(minutes: number | null): string | null {
  if (!minutes) return null
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return hours > 0 ? `${hours}h ${rest}min` : `${rest}min`
}

function Dot() {
  return <span className="text-muted-foreground/40">·</span>
}

export function MovieDetailsView({ movie }: { movie: MovieDetails }) {
  const backdrop = backdropUrl(movie.backdropPath, 'w1280')
  const runtime = formatRuntime(movie.runtime)

  return (
    <article className="space-y-10">
      <header className="relative overflow-hidden rounded-2xl border">
        {backdrop ? (
          <>
            <img
              src={backdrop}
              alt=""
              className="absolute inset-0 size-full object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/40" />
          </>
        ) : null}
        <div className="relative flex flex-col gap-6 p-6 sm:flex-row sm:gap-8 sm:p-8">
          <TmdbImage
            path={movie.posterPath}
            size="w342"
            alt={`Pôster de ${movie.title}`}
            loading="eager"
            className="aspect-[2/3] w-32 shrink-0 rounded-xl border shadow-xl shadow-black/20 sm:w-48"
          />

          <div className="flex flex-col gap-3">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {movie.title}
              </h1>
              {movie.tagline ? (
                <p className="text-muted-foreground italic">{movie.tagline}</p>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
              <RatingBadge
                value={movie.rating}
                iconClassName="size-4"
                className="font-medium text-foreground"
              />
              <span>({movie.voteCount.toLocaleString('pt-BR')})</span>
              {movie.year ? (
                <>
                  <Dot />
                  <span>{movie.year}</span>
                </>
              ) : null}
              {runtime ? (
                <>
                  <Dot />
                  <span>{runtime}</span>
                </>
              ) : null}
            </div>

            {movie.genres.length > 0 ? (
              <ul className="flex flex-wrap gap-1.5">
                {movie.genres.map((genre) => (
                  <li
                    key={genre.id}
                    className="rounded-full border px-2.5 py-0.5 text-xs text-muted-foreground"
                  >
                    {genre.name}
                  </li>
                ))}
              </ul>
            ) : null}

            {movie.overview ? (
              <p className="max-w-prose text-sm leading-relaxed text-foreground/90">
                {movie.overview}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Sinopse não disponível.
              </p>
            )}

            <div className="mt-auto pt-2">
              <WatchlistToggleButton movie={movie} />
            </div>
          </div>
        </div>
      </header>

      <MovieTrailer trailerKey={movie.trailerKey} title={movie.title} />
      <MovieCast cast={movie.cast} />
    </article>
  )
}
