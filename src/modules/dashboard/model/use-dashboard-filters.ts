import { getRouteApi } from '@tanstack/react-router'
import { useCallback } from 'react'

import type { DashboardSearch } from './search-schema'

const routeApi = getRouteApi('/_authenticated/')

export type FilterPatch = Partial<DashboardSearch>

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
        year: undefined,
        genre: undefined,
        minRating: undefined,
      },
    })
  }, [navigate])

  return { filters, setFilters, resetFilters, hasActiveFilters }
}
