import {
  type SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon } from 'lucide-react'
import { useMemo, useState } from 'react'

import { useWatchlistActions } from '@/features/watchlist'
import { cn } from '@/shared/lib/cn'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table'

import {
  type WatchlistRow,
  createWatchlistColumns,
} from '../model/watchlist-columns'

const SORT_ICON = { asc: ArrowUpIcon, desc: ArrowDownIcon } as const

export function WatchlistTable({ rows }: { rows: WatchlistRow[] }) {
  const { remove } = useWatchlistActions()
  const [sorting, setSorting] = useState<SortingState>([])

  const columns = useMemo(() => createWatchlistColumns(remove), [remove])

  // eslint-disable-next-line react-hooks/incompatible-library -- table is consumed inline, not memoized downstream
  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: (row) => String(row.id),
  })

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              const canSort = header.column.getCanSort()
              const direction = header.column.getIsSorted()
              const Icon = direction ? SORT_ICON[direction] : ChevronsUpDownIcon
              return (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : canSort ? (
                    <button
                      type="button"
                      onClick={header.column.getToggleSortingHandler()}
                      className={cn(
                        'flex items-center gap-1 hover:text-foreground',
                        direction && 'text-foreground',
                      )}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      <Icon className="size-3.5" />
                    </button>
                  ) : (
                    flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )
                  )}
                </TableHead>
              )
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
