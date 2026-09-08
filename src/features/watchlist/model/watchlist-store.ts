import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { MovieListItem } from '@/_core/models/responses/movie'

/** The snapshot we keep for a saved movie — enough to render the table offline. */
export interface WatchlistMovie {
  id: number
  title: string
  posterPath: string | null
  releaseDate: string | null
  year: number | null
  rating: number
  genreIds: number[]
  addedAt: number
}

export function toWatchlistMovie(movie: MovieListItem): WatchlistMovie {
  return {
    id: movie.id,
    title: movie.title,
    posterPath: movie.posterPath,
    releaseDate: movie.releaseDate,
    year: movie.year,
    rating: movie.rating,
    genreIds: movie.genreIds,
    addedAt: Date.now(),
  }
}

interface WatchlistState {
  items: WatchlistMovie[]
  add: (movie: MovieListItem) => void
  remove: (id: number) => void
  toggle: (movie: MovieListItem) => boolean
  clear: () => void
}

export const WATCHLIST_STORAGE_KEY = 'cinedash:watchlist'

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (movie) => {
        if (get().items.some((item) => item.id === movie.id)) return
        set((state) => ({ items: [toWatchlistMovie(movie), ...state.items] }))
      },
      remove: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      /** Returns `true` when the movie ended up in the list, `false` when removed. */
      toggle: (movie) => {
        const exists = get().items.some((item) => item.id === movie.id)
        if (exists) {
          get().remove(movie.id)
          return false
        }
        get().add(movie)
        return true
      },
      clear: () => set({ items: [] }),
    }),
    { name: WATCHLIST_STORAGE_KEY },
  ),
)
