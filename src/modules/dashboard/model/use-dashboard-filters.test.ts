import { renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { DashboardSearch } from './search-schema'
import { useDashboardFilters } from './use-dashboard-filters'

let currentSearch: DashboardSearch = { page: 1 }
const navigate = vi.fn()

vi.mock('@tanstack/react-router', () => ({
  getRouteApi: () => ({
    useSearch: () => currentSearch,
    useNavigate: () => navigate,
  }),
}))

/** Runs the `search` updater that the last `navigate` call received. */
function applyLastNavigate(prev: DashboardSearch): DashboardSearch {
  const { search } = navigate.mock.calls.at(-1)?.[0] as {
    search: DashboardSearch | ((p: DashboardSearch) => DashboardSearch)
  }
  return typeof search === 'function' ? search(prev) : search
}

afterEach(() => {
  currentSearch = { page: 1 }
  navigate.mockClear()
})

describe('useDashboardFilters', () => {
  it('reseta para a página 1 quando um filtro (não a página) muda', () => {
    const { result } = renderHook(() => useDashboardFilters())

    result.current.setFilters({ genre: 28 })

    expect(applyLastNavigate({ page: 3 })).toEqual({ page: 1, genre: 28 })
  })

  it('mantém a página quando o patch é a própria página', () => {
    const { result } = renderHook(() => useDashboardFilters())

    result.current.setFilters({ page: 5 })

    expect(applyLastNavigate({ page: 1 })).toEqual({ page: 5 })
  })

  it('resetFilters limpa todos os filtros e volta pra página 1', () => {
    const { result } = renderHook(() => useDashboardFilters())

    result.current.resetFilters()

    expect(navigate).toHaveBeenCalledWith({
      search: {
        page: 1,
        q: undefined,
        year: undefined,
        genre: undefined,
        minRating: undefined,
      },
    })
  })

  it('hasActiveFilters reflete se há algum filtro na URL', () => {
    currentSearch = { page: 1 }
    expect(
      renderHook(() => useDashboardFilters()).result.current.hasActiveFilters,
    ).toBe(false)

    currentSearch = { page: 2, genre: 12 }
    expect(
      renderHook(() => useDashboardFilters()).result.current.hasActiveFilters,
    ).toBe(true)
  })
})
