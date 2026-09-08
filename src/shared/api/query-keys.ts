export const queryKeys = {
  movies: {
    all: ['movies'] as const,
    trending: (page: number) =>
      [...queryKeys.movies.all, 'trending', page] as const,
    popular: (page: number) =>
      [...queryKeys.movies.all, 'popular', page] as const,
    detail: (id: number) => [...queryKeys.movies.all, 'detail', id] as const,
    search: (term: string, page: number) =>
      [...queryKeys.movies.all, 'search', term, page] as const,
  },
  genres: {
    all: ['genres'] as const,
    list: () => [...queryKeys.genres.all, 'list'] as const,
  },
} as const
