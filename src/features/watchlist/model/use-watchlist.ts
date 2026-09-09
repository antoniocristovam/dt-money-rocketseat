import { useWatchlistStore } from './watchlist-store'

export function useWatchlist() {
  return useWatchlistStore((state) => state.items)
}

export function useWatchlistCount() {
  return useWatchlistStore((state) => state.items.length)
}

export function useIsInWatchlist(id: number) {
  return useWatchlistStore((state) =>
    state.items.some((item) => item.id === id),
  )
}

export function useWatchlistActions() {
  const toggle = useWatchlistStore((state) => state.toggle)
  const remove = useWatchlistStore((state) => state.remove)
  const clear = useWatchlistStore((state) => state.clear)
  return { toggle, remove, clear }
}
