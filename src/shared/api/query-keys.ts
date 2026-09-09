/**
 * Central registry of TanStack Query cache keys. One typed factory keeps
 * `useQuery` calls and `invalidateQueries` in sync.
 */
export const queryKeys = {
  movies: {
    all: ['movies'] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.movies.all, 'list', filters] as const,
    detail: (id: number) => [...queryKeys.movies.all, 'detail', id] as const,
  },
  genres: {
    all: ['genres'] as const,
    list: () => [...queryKeys.genres.all, 'list'] as const,
  },
} as const
