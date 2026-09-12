import { Link } from '@tanstack/react-router'
import { BookmarkIcon } from 'lucide-react'
import { useMemo } from 'react'

import { useGenres } from '@/features/genres'
import { useWatchlist, useWatchlistActions } from '@/features/watchlist'
import { EmptyState } from '@/shared/components/empty-state'
import { Button } from '@/shared/ui/button'

import { WatchlistTable } from '../components/watchlist-table'
import type { WatchlistRow } from '../model/watchlist-columns'

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
      <header className="flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Minha lista</h1>
          <p className="text-sm text-muted-foreground">
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
        <EmptyState
          icon={<BookmarkIcon />}
          title="Sua estante está vazia"
          description="Adicione filmes pelo botão de marcador no dashboard."
          action={
            <Button asChild>
              <Link to="/">Explorar filmes</Link>
            </Button>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card">
          <WatchlistTable rows={rows} />
        </div>
      )}
    </section>
  )
}
