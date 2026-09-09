import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'

import { HttpError } from '@/shared/api/http-error'
import { notify } from '@/shared/lib/notify'

interface CacheMeta {
  /** Skip the global error toast — the UI already renders its own error state. */
  skipErrorToast?: boolean
}

declare module '@tanstack/react-query' {
  interface Register {
    queryMeta: CacheMeta
    mutationMeta: CacheMeta
  }
}

/** A 404 means "not found" — the screen shows that in place, no toast needed. */
function isNotFound(error: unknown): boolean {
  return error instanceof HttpError && error.status === 404
}

/**
 * Every failed query/mutation surfaces a toast with the server message, unless
 * it opts out via `meta.skipErrorToast` or the failure is a plain 404.
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => {
        if (query.meta?.skipErrorToast || isNotFound(error)) return
        notify.fromError(error)
      },
    }),
    mutationCache: new MutationCache({
      onError: (error, _variables, _context, mutation) => {
        if (mutation.meta?.skipErrorToast || isNotFound(error)) return
        notify.fromError(error)
      },
    }),
    defaultOptions: {
      queries: {
        retry: 1,
        staleTime: 60_000,
        gcTime: 5 * 60_000,
        refetchOnWindowFocus: false,
        // Always run the request and treat failures as errors (so `onError`
        // fires) instead of silently pausing on flaky `navigator.onLine`.
        networkMode: 'always',
      },
      mutations: { networkMode: 'always' },
    },
  })
}
