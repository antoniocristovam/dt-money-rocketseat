import { ImageIcon, StarIcon } from 'lucide-react'

import type { MovieDetails } from '@/_core/models/responses/movie'
import { backdropUrl, posterUrl } from '@/shared/lib/tmdb-image'
import { WatchlistToggleButton } from '@/widgets/watchlist-toggle-button'

import { MovieCast } from './movie-cast'
import { MovieTrailer } from './movie-trailer'

function formatRuntime(minutes: number | null): string | null {
  if (!minutes) return null
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return hours > 0 ? `${hours}h ${rest}min` : `${rest}min`
}

export function MovieDetailsView({ movie }: { movie: MovieDetails }) {
  const poster = posterUrl(movie.posterPath, 'w342')
  const backdrop = backdropUrl(movie.backdropPath, 'w1280')
  const runtime = formatRuntime(movie.runtime)

  const meta = [
    movie.year,
    runtime,
    movie.genres.map((genre) => genre.name).join(', ') || null,
  ].filter(Boolean)

  return (
    <article className="space-y-8">
      <header className="relative overflow-hidden rounded-xl border">
        {backdrop ? (
          <img
            src={backdrop}
            alt=""
            className="absolute inset-0 size-full object-cover opacity-20"
          />
        ) : null}
        <div className="relative flex flex-col gap-6 p-6 sm:flex-row">
          <div className="aspect-[2/3] w-32 shrink-0 overflow-hidden rounded-lg border bg-muted sm:w-44">
            {poster ? (
              <img
                src={poster}
                alt={`Pôster de ${movie.title}`}
                className="size-full object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center text-muted-foreground">
                <ImageIcon className="size-8" />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {movie.title}
              </h1>
              {movie.tagline ? (
                <p className="text-muted-foreground italic">{movie.tagline}</p>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1 font-medium text-foreground">
                <StarIcon className="size-4 fill-amber-400 text-amber-400" />
                {movie.rating.toFixed(1)}
                <span className="font-normal text-muted-foreground">
                  ({movie.voteCount.toLocaleString('pt-BR')})
                </span>
              </span>
              {meta.map((item) => (
                <span key={String(item)}>{item}</span>
              ))}
            </div>

            {movie.overview ? (
              <p className="max-w-prose text-sm leading-relaxed">
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
