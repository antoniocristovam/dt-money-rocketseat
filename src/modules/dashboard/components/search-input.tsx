import { Loader2Icon, SearchIcon } from 'lucide-react'
import { useCallback } from 'react'

import { cn } from '@/shared/lib/cn'
import { Input } from '@/shared/ui/input'

import { useDashboardFilters } from '../model/use-dashboard-filters'
import { useSearchInput } from '../model/use-search-input'

export function SearchInput({ isFetching = false }: { isFetching?: boolean }) {
  const { filters, setFilters } = useDashboardFilters()

  const commit = useCallback(
    (q: string | undefined) => setFilters({ q }),
    [setFilters],
  )
  const { text, setText, isDebouncing } = useSearchInput(filters.q, commit)

  const isBusy = isDebouncing || (isFetching && filters.q !== undefined)

  return (
    <div className="relative w-full sm:max-w-sm">
      <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Buscar filmes…"
        aria-label="Buscar filmes"
        className={cn('bg-background pl-9', isBusy && 'pr-9')}
      />
      <Loader2Icon
        aria-hidden={!isBusy}
        className={cn(
          'pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground transition-opacity',
          isBusy ? 'opacity-100' : 'opacity-0',
        )}
      />
    </div>
  )
}
