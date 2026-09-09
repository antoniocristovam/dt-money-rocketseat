import { useMemo } from 'react'

import { useWatchlistActions } from '@/features/watchlist'
import { DataTable } from '@/shared/components/data-table'

import {
  type WatchlistRow,
  createWatchlistColumns,
} from '../model/watchlist-columns'

export function WatchlistTable({ rows }: { rows: WatchlistRow[] }) {
  const { remove } = useWatchlistActions()
  const columns = useMemo(() => createWatchlistColumns(remove), [remove])

  return (
    <DataTable
      columns={columns}
      data={rows}
      getRowId={(row) => String(row.id)}
    />
  )
}
