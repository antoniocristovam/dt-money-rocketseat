import { SearchIcon } from 'lucide-react'
import { useCallback } from 'react'

import { Input } from '@/shared/ui/input'

import { useDashboardFilters } from '../model/use-dashboard-filters'
import { useSearchInput } from '../model/use-search-input'

export function SearchInput() {
  const { filters, setFilters } = useDashboardFilters()

  const commit = useCallback(
    (q: string | undefined) => setFilters({ q }),
    [setFilters],
  )
  const { text, setText } = useSearchInput(filters.q, commit)

  return (
    <div className="relative w-full sm:max-w-xs">
      <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Buscar filmes…"
        aria-label="Buscar filmes"
        className="pl-9"
      />
    </div>
  )
}
