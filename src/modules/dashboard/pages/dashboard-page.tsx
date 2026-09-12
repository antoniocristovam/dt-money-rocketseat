import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'

import type { GetMoviesParams } from '@/_core/models/params/movie'
import { useGenresQuery } from '@/features/genres'
import { movieService } from '@/services/movie'
import { queryKeys } from '@/shared/api/query-keys'
import { cn } from '@/shared/lib/cn'

import { DashboardPagination } from '../components/dashboard-pagination'
import { MovieFilters } from '../components/movie-filters'
import { MovieGrid } from '../components/movie-grid'
import { SearchInput } from '../components/search-input'
import { useMovies } from '../hooks/use-movies'
import type { DashboardSearch } from '../model/search-schema'
import { useDashboardFilters } from '../model/use-dashboard-filters'

function toMoviesParams(filters: DashboardSearch): GetMoviesParams {
  return {
    page: filters.page,
    query: filters.q,
    genreId: filters.genre,
    year: filters.year,
    minRating: filters.minRating,
  }
}

export const DashboardPage = () => {
  const queryClient = useQueryClient()
  const { filters } = useDashboardFilters()
  const params = useMemo(() => toMoviesParams(filters), [filters])

  const moviesQuery = useMovies(params)
  const genresQuery = useGenresQuery()

  const page = moviesQuery.data
  const totalPages = page?.totalPages ?? 0
  const isRefetching = moviesQuery.isFetching && !moviesQuery.isLoading

  useEffect(() => {
    if (!page || params.page >= totalPages) return
    const nextParams = { ...params, page: params.page + 1 }
    void queryClient.prefetchQuery({
      queryKey: queryKeys.movies.list(nextParams),
      queryFn: () => movieService.getMovies(nextParams),
      staleTime: 60_000,
    })
  }, [page, totalPages, params, queryClient])

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Descoberta</h1>
          <p className="text-sm text-muted-foreground">
            Explore o catálogo do TMDB para montar a curadoria do streaming.
          </p>
        </div>
        {page && !moviesQuery.isError ? (
          <p className="shrink-0 text-sm text-muted-foreground tabular-nums">
            {page.totalResults.toLocaleString('pt-BR')} filmes encontrados
          </p>
        ) : null}
      </header>

      <div className="flex flex-col gap-3 rounded-xl border bg-muted/30 p-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput isFetching={moviesQuery.isFetching} />
        <MovieFilters />
      </div>

      <div
        className={cn(
          'transition-opacity',
          isRefetching && 'pointer-events-none opacity-60',
        )}
      >
        <MovieGrid
          movies={page?.results ?? []}
          isError={moviesQuery.isError}
          genres={genresQuery.data ?? []}
          isLoading={moviesQuery.isLoading}
          onRetry={() => void moviesQuery.refetch()}
        />
      </div>

      <DashboardPagination
        totalPages={totalPages}
        disabled={moviesQuery.isFetching}
      />
    </section>
  )
}
