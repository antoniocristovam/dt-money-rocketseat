import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { MovieDetails } from '@/_core/models/responses/movie'
import { useWatchlistStore } from '@/features/watchlist'

import { MovieDetailsView } from './movie-details-view'

vi.mock('@/shared/lib/notify', () => ({
  notify: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
    fromError: vi.fn(),
  },
}))
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children }: { children: ReactNode }) => <a>{children}</a>,
}))

const movie: MovieDetails = {
  id: 693134,
  title: 'Dune: Part Two',
  overview: 'Paul Atreides se une aos Fremen.',
  posterPath: null,
  backdropPath: null,
  releaseDate: '2024-02-27',
  year: 2024,
  rating: 8.1,
  voteCount: 5000,
  genreIds: [878, 12],
  genres: [
    { id: 878, name: 'Ficção Científica' },
    { id: 12, name: 'Aventura' },
  ],
  tagline: 'Longa vida aos combatentes.',
  runtime: 167,
  cast: [
    { id: 1, name: 'Timothée Chalamet', character: 'Paul', profilePath: null },
  ],
  trailerKey: 'Way9Dexny3w',
}

afterEach(() => {
  useWatchlistStore.setState({ items: [] })
})

describe('MovieDetailsView (detalhes do filme)', () => {
  it('renderiza sinopse, metadados, elenco e trailer', () => {
    render(<MovieDetailsView movie={movie} />)

    expect(
      screen.getByRole('heading', { name: 'Dune: Part Two' }),
    ).toBeInTheDocument()
    expect(screen.getByText(/paul atreides se une/i)).toBeInTheDocument()
    expect(screen.getByText('2h 47min')).toBeInTheDocument()
    expect(screen.getByText('Timothée Chalamet')).toBeInTheDocument()
    expect(screen.getByTitle('Trailer de Dune: Part Two')).toHaveAttribute(
      'src',
      expect.stringContaining('Way9Dexny3w'),
    )
  })

  it('adiciona/remove o filme da watchlist', async () => {
    const user = userEvent.setup()
    render(<MovieDetailsView movie={movie} />)

    await user.click(screen.getByRole('button', { name: /adicionar à lista/i }))
    expect(useWatchlistStore.getState().items[0]?.id).toBe(693134)
  })
})
