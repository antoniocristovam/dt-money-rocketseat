import { Link } from '@tanstack/react-router'
import { type ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { Trash2Icon } from 'lucide-react'

import type { WatchlistMovie } from '@/features/watchlist'
import { RatingBadge } from '@/shared/components/rating-badge'
import { TmdbImage } from '@/shared/components/tmdb-image'
import { Button } from '@/shared/ui/button'

export type WatchlistRow = WatchlistMovie & { genre: string }

const columnHelper = createColumnHelper<WatchlistRow>()

const dateFormatter = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' })

function formatDate(date: string | null): string {
  if (!date) return '—'
  const [year, month, day] = date.split('-').map(Number)
  if (!year || !month || !day) return '—'
  return dateFormatter.format(new Date(year, month - 1, day))
}

export function createWatchlistColumns(
  onRemove: (id: number) => void,
): ColumnDef<WatchlistRow>[] {
  return [
    columnHelper.accessor('title', {
      header: 'Título',
      sortingFn: 'text',
      cell: ({ row }) => {
        const movie = row.original
        return (
          <Link
            to="/movie/$movieId"
            params={{ movieId: String(movie.id) }}
            className="flex items-center gap-3 font-medium hover:text-primary"
          >
            <TmdbImage
              path={movie.posterPath}
              size="w154"
              alt=""
              fallback={null}
              className="h-14 w-10 shrink-0 rounded"
            />
            <span className="line-clamp-2">{movie.title}</span>
          </Link>
        )
      },
    }),
    columnHelper.accessor('genre', {
      header: 'Gênero',
      sortingFn: 'text',
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">{getValue()}</span>
      ),
    }),
    columnHelper.accessor('releaseDate', {
      header: 'Lançamento',
      sortingFn: (a, b) =>
        (a.original.releaseDate ?? '').localeCompare(
          b.original.releaseDate ?? '',
        ),
      cell: ({ getValue }) => (
        <span className="whitespace-nowrap text-muted-foreground">
          {formatDate(getValue())}
        </span>
      ),
    }),
    columnHelper.accessor('rating', {
      header: 'Nota',
      enableSorting: false,
      cell: ({ getValue }) => (
        <RatingBadge value={getValue()} className="tabular-nums" />
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: () => <span className="sr-only">Ações</span>,
      cell: ({ row }) => (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={`Remover "${row.original.title}" da lista`}
          onClick={() => onRemove(row.original.id)}
        >
          <Trash2Icon className="size-4" />
        </Button>
      ),
    }),
  ] as ColumnDef<WatchlistRow>[]
}
