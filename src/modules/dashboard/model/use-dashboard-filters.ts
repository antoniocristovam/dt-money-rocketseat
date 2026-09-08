import { getRouteApi } from '@tanstack/react-router'
import { useCallback } from 'react'

import type { DashboardSearch } from './search-schema'

const routeApi = getRouteApi('/_authenticated/')

export type FilterPatch = Partial<DashboardSearch>

/**
 * Reads the discovery filters from the URL and writes them back. Any change
 * except an explicit `page` resets pagination to page 1.
 */
export function useDashboardFilters() {
  const filters = routeApi.useSearch()
  const navigate = routeApi.useNavigate()

  const setFilters = useCallback(
    (patch: FilterPatch) => {
      void navigate({
        search: (prev) => {
          const next: DashboardSearch = { ...prev, ...patch }
          if (!('page' in patch)) next.page = 1
          return next
        },
      })
    },
    [navigate],
  )

  const hasActiveFilters =
    filters.q !== undefined ||
    filters.genre !== undefined ||
    filters.year !== undefined ||
    filters.minRating !== undefined

  const resetFilters = useCallback(() => {
    void navigate({
      search: {
        page: 1,
        q: undefined,
        genre: undefined,
        year: undefined,
        minRating: undefined,
      },
    })
  }, [navigate])

  return { filters, setFilters, resetFilters, hasActiveFilters }
}
