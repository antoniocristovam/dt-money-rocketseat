import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { useWatchlistStore } from '@/features/watchlist'

import type { WatchlistRow } from '../model/watchlist-columns'

import { WatchlistTable } from './watchlist-table'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children }: { children: ReactNode }) => <a>{children}</a>,
}))

vi.mock('@/entities/movie', () => ({ posterUrl: () => null }))

const rows: WatchlistRow[] = [
  {
    id: 1,
    title: 'Zodiac',
    posterPath: null,
    releaseDate: '2007-03-02',
    year: 2007,
    rating: 7.5,
    genreIds: [80],
    addedAt: 1,
    genre: 'Crime',
  },
  {
    id: 2,
    title: 'Alien',
    posterPath: null,
    releaseDate: '1979-05-25',
    year: 1979,
    rating: 8.4,
    genreIds: [27],
    addedAt: 2,
    genre: 'Terror',
  },
]

function rowTitles() {
  return screen
    .getAllByRole('row')
    .slice(1)
    .map((row) => within(row).getAllByRole('cell')[0]?.textContent)
}

afterEach(() => {
  useWatchlistStore.setState({ items: [] })
})

describe('WatchlistTable', () => {
  it('sorts by title when the header is clicked', async () => {
    const user = userEvent.setup()
    render(<WatchlistTable rows={rows} />)

    expect(rowTitles()).toEqual(['Zodiac', 'Alien'])

    await user.click(screen.getByRole('button', { name: /título/i }))
    expect(rowTitles()).toEqual(['Alien', 'Zodiac'])

    await user.click(screen.getByRole('button', { name: /título/i }))
    expect(rowTitles()).toEqual(['Zodiac', 'Alien'])
  })

  it('sorts by genre', async () => {
    const user = userEvent.setup()
    render(<WatchlistTable rows={rows} />)

    await user.click(screen.getByRole('button', { name: /gênero/i }))
    expect(rowTitles()).toEqual(['Zodiac', 'Alien']) // Crime < Terror
  })

  it('removes a movie from the store via the row action', async () => {
    const user = userEvent.setup()
    useWatchlistStore.setState({
      items: rows.map((row) => ({ ...row })),
    })
    render(<WatchlistTable rows={rows} />)

    await user.click(
      screen.getByRole('button', { name: /remover "alien" da lista/i }),
    )

    expect(useWatchlistStore.getState().items.map((m) => m.title)).toEqual([
      'Zodiac',
    ])
  })
})
