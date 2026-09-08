import { Link } from '@tanstack/react-router'
import { BookmarkIcon } from 'lucide-react'
import { useMemo } from 'react'

import { useGenres } from '@/features/genres'
import { useWatchlist, useWatchlistActions } from '@/features/watchlist'
import { Button } from '@/shared/ui/button'

import type { WatchlistRow } from '../model/watchlist-columns'
import { WatchlistTable } from '../ui/watchlist-table'

export const WatchlistPage = () => {
  const movies = useWatchlist()
  const { clear } = useWatchlistActions()
  const { resolve } = useGenres()

  const rows = useMemo<WatchlistRow[]>(
    () =>
      movies.map((movie) => ({
        ...movie,
        genre: resolve(movie.genreIds) || '—',
      })),
    [movies, resolve],
  )

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Minha lista</h1>
          <p className="text-muted-foreground">
            {movies.length === 0
              ? 'Nenhum filme salvo ainda.'
              : `${movies.length.toLocaleString('pt-BR')} ${
                  movies.length === 1 ? 'filme salvo' : 'filmes salvos'
                }.`}
          </p>
        </div>
        {movies.length > 0 ? (
          <Button variant="outline" size="sm" onClick={clear}>
            Limpar lista
          </Button>
        ) : null}
      </header>

      {rows.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed py-16 text-center">
          <BookmarkIcon className="size-8 text-muted-foreground" />
          <div className="space-y-1">
            <p className="font-medium">Sua estante está vazia</p>
            <p className="text-sm text-muted-foreground">
              Adicione filmes pelo botão de marcador no dashboard.
            </p>
          </div>
          <Button asChild>
            <Link to="/">Explorar filmes</Link>
          </Button>
        </div>
      ) : (
        <WatchlistTable rows={rows} />
      )}
    </section>
  )
}
