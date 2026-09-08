import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { MovieListItem } from '@/_core/models/responses/movie'

import { useWatchlistStore } from '../model/watchlist-store'

import { WatchlistToggleButton } from './watchlist-toggle-button'

vi.mock('sonner', () => ({ toast: { success: vi.fn() } }))

const movie = {
  id: 42,
  title: 'Contact',
  overview: '',
  posterPath: null,
  backdropPath: null,
  releaseDate: '1997-07-11',
  year: 1997,
  rating: 7.4,
  voteCount: 1,
  genreIds: [878],
} satisfies MovieListItem

afterEach(() => {
  useWatchlistStore.setState({ items: [] })
})

describe('WatchlistToggleButton', () => {
  it('adds and removes the movie, reflecting state on the button', async () => {
    const user = userEvent.setup()
    render(<WatchlistToggleButton movie={movie} />)

    const button = screen.getByRole('button', { name: /adicionar à lista/i })
    await user.click(button)

    expect(useWatchlistStore.getState().items).toHaveLength(1)
    expect(
      screen.getByRole('button', { name: /na minha lista/i }),
    ).toHaveAttribute('aria-pressed', 'true')

    await user.click(screen.getByRole('button', { name: /na minha lista/i }))
    expect(useWatchlistStore.getState().items).toHaveLength(0)
  })
})
