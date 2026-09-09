import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { GetMoviesResponse } from '@/_core/models/responses/movie'
import { movieService } from '@/services/movie'

import type { DashboardSearch } from '../model/search-schema'

import { DashboardPage } from './dashboard-page'

/* ------------------------------------------------------------------ *
 * Router mock: `getRouteApi().useSearch()` reads from an external
 * store that `navigate()` mutates, so filter changes actually
 * re-render the page — just like the real URL round-trip.
 * ------------------------------------------------------------------ */
let mockSearch: DashboardSearch = { page: 1 }
const mockListeners = new Set<() => void>()

function setMockSearch(next: DashboardSearch) {
  mockSearch = next
  mockListeners.forEach((listener) => listener())
}

const mockNavigate = vi.fn(
  (opts: {
    search: DashboardSearch | ((prev: DashboardSearch) => DashboardSearch)
  }) => {
    setMockSearch(
      typeof opts.search === 'function' ? opts.search(mockSearch) : opts.search,
    )
  },
)

vi.mock('@tanstack/react-router', async () => {
  const { useSyncExternalStore } = await import('react')
  return {
    getRouteApi: () => ({
      useSearch: () =>
        useSyncExternalStore(
          (cb) => {
            mockListeners.add(cb)
            return () => mockListeners.delete(cb)
          },
          () => mockSearch,
        ),
      useNavigate: () => mockNavigate,
    }),
  }
})

vi.mock('@/features/genres', () => ({
  useGenresQuery: () => ({ data: [], isLoading: false, isError: false }),
}))

vi.mock('@/services/movie', () => ({
  movieService: { getMovies: vi.fn(), getGenres: vi.fn() },
}))

/** Lightweight grid double — the real one has its own test. */
vi.mock('../components/movie-grid', () => ({
  MovieGrid: ({
    movies,
    isError,
    onRetry,
  }: {
    movies: { id: number; title: string }[]
    isError: boolean
    onRetry: () => void
  }) =>
    isError ? (
      <button onClick={onRetry}>Tentar novamente</button>
    ) : (
      <ul>
        {movies.map((movie) => (
          <li key={movie.id}>{movie.title}</li>
        ))}
      </ul>
    ),
}))

/** Filter double — clicking it applies a genre through the real hook. */
vi.mock('../components/movie-filters', async () => {
  const { useDashboardFilters: useFilters } =
    await import('../model/use-dashboard-filters')
  return {
    MovieFilters: () => {
      const { setFilters } = useFilters()
      return <button onClick={() => setFilters({ genre: 28 })}>Ação</button>
    },
  }
})

const getMovies = vi.mocked(movieService).getMovies

function moviesResponse(
  over: Partial<GetMoviesResponse> = {},
): GetMoviesResponse {
  return {
    page: 1,
    totalPages: 3,
    totalResults: 1234,
    results: [
      {
        id: 1,
        title: 'Duna',
        overview: '',
        posterPath: null,
        backdropPath: null,
        releaseDate: null,
        year: null,
        rating: 8,
        voteCount: 10,
        genreIds: [],
      },
    ],
    ...over,
  }
}

function renderPage() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={client}>
      <DashboardPage />
    </QueryClientProvider>,
  )
}

beforeEach(() => {
  mockSearch = { page: 1 }
  mockNavigate.mockClear()
  getMovies.mockReset()
})

afterEach(() => {
  mockListeners.clear()
})

describe('DashboardPage (fluxo da descoberta)', () => {
  it('renderiza os filmes e a contagem de resultados', async () => {
    getMovies.mockResolvedValue(moviesResponse())

    renderPage()

    expect(await screen.findByText('Duna')).toBeInTheDocument()
    expect(screen.getByText('1.234 filmes encontrados')).toBeInTheDocument()
    expect(getMovies).toHaveBeenCalledWith(
      expect.objectContaining({ page: 1, query: undefined }),
    )
  })

  it('mudar um filtro reseta a busca para a página 1', async () => {
    mockSearch = { page: 3 }
    getMovies.mockResolvedValue(moviesResponse({ page: 3 }))

    renderPage()
    await screen.findByText('Duna')

    await userEvent.click(screen.getByRole('button', { name: 'Ação' }))

    await waitFor(() => {
      expect(getMovies).toHaveBeenCalledWith(
        expect.objectContaining({ page: 1, genreId: 28 }),
      )
    })
    expect(mockSearch.page).toBe(1)
  })

  it('digitar na busca dispara uma nova requisição com o termo', async () => {
    getMovies.mockResolvedValue(moviesResponse())

    renderPage()
    await screen.findByText('Duna')

    await userEvent.type(screen.getByLabelText('Buscar filmes'), 'duna')

    await waitFor(
      () => {
        expect(getMovies).toHaveBeenCalledWith(
          expect.objectContaining({ page: 1, query: 'duna' }),
        )
      },
      { timeout: 2000 },
    )
  })

  it('mostra o botão de tentar novamente quando a requisição falha', async () => {
    getMovies.mockRejectedValue(new Error('falha de rede'))

    renderPage()

    expect(
      await screen.findByRole('button', { name: /tentar novamente/i }),
    ).toBeInTheDocument()
  })
})
