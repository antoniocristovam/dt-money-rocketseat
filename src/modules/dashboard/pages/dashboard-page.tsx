import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'

import { type MovieQuery, fetchMovies, useGenresQuery } from '@/entities/movie'
import { queryKeys } from '@/shared/api/query-keys'
import { cn } from '@/shared/lib/cn'

import type { DashboardSearch } from '../model/search-schema'
import { useDashboardFilters } from '../model/use-dashboard-filters'
import { useMoviesQuery } from '../model/use-movies-query'
import { DashboardPagination } from '../ui/dashboard-pagination'
import { MovieFilters } from '../ui/movie-filters'
import { MovieGrid } from '../ui/movie-grid'
import { SearchInput } from '../ui/search-input'

function toMovieQuery(filters: DashboardSearch): MovieQuery {
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
  const query = useMemo(() => toMovieQuery(filters), [filters])

  const moviesQuery = useMoviesQuery(query)
  const genresQuery = useGenresQuery()

  const page = moviesQuery.data
  const totalPages = page?.totalPages ?? 0
  // Background refetch (filters/search/page changed) while old results stay on screen.
  const isRefetching = moviesQuery.isFetching && !moviesQuery.isLoading

  // Prefetch the next page so forward pagination feels instant.
  useEffect(() => {
    if (!page || query.page >= totalPages) return
    const nextParams = { ...query, page: query.page + 1 }
    void queryClient.prefetchQuery({
      queryKey: queryKeys.movies.list(nextParams),
      queryFn: () => fetchMovies(nextParams),
      staleTime: 60_000,
    })
  }, [page, totalPages, query, queryClient])

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Descoberta</h1>
        <p className="text-muted-foreground">
          Explore o catálogo do TMDB para montar a curadoria do streaming.
        </p>
      </header>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <SearchInput isFetching={moviesQuery.isFetching} />
        <MovieFilters />
      </div>

      {page && !moviesQuery.isError ? (
        <p className="text-sm text-muted-foreground">
          {page.totalResults.toLocaleString('pt-BR')} filmes encontrados
        </p>
      ) : null}

      <div
        className={cn(
          'transition-opacity',
          isRefetching && 'pointer-events-none opacity-60',
        )}
      >
        <MovieGrid
          movies={page?.results ?? []}
          genres={genresQuery.data ?? []}
          isLoading={moviesQuery.isLoading}
          isError={moviesQuery.isError}
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
