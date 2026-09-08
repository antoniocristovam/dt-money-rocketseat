import { afterEach, describe, expect, it } from 'vitest'

import type { MovieListItem } from '@/_core/models/responses/movie'

import { useWatchlistStore } from './watchlist-store'

const movie: MovieListItem = {
  id: 603,
  title: 'The Matrix',
  overview: '',
  posterPath: '/matrix.jpg',
  backdropPath: null,
  releaseDate: '1999-03-30',
  year: 1999,
  rating: 8.2,
  voteCount: 1,
  genreIds: [28, 878],
}

afterEach(() => {
  useWatchlistStore.setState({ items: [] })
  localStorage.clear()
})

describe('watchlist-store', () => {
  it('adds a movie as a trimmed snapshot', () => {
    useWatchlistStore.getState().add(movie)

    const [saved] = useWatchlistStore.getState().items
    expect(saved).toMatchObject({
      id: 603,
      title: 'The Matrix',
      releaseDate: '1999-03-30',
      rating: 8.2,
      genreIds: [28, 878],
    })
    expect(saved?.addedAt).toEqual(expect.any(Number))
  })

  it('does not add the same movie twice', () => {
    const { add } = useWatchlistStore.getState()
    add(movie)
    add(movie)
    expect(useWatchlistStore.getState().items).toHaveLength(1)
  })

  it('toggle adds then removes, returning the resulting state', () => {
    const { toggle } = useWatchlistStore.getState()
    expect(toggle(movie)).toBe(true)
    expect(useWatchlistStore.getState().items).toHaveLength(1)
    expect(toggle(movie)).toBe(false)
    expect(useWatchlistStore.getState().items).toHaveLength(0)
  })

  it('persists to localStorage under the storage key', () => {
    useWatchlistStore.getState().add(movie)
    expect(localStorage.getItem('cinedash:watchlist')).toContain('The Matrix')
  })
})
