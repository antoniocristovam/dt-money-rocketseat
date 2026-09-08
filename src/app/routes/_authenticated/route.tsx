import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

import { getSession } from '@/features/auth'

/**
 * Pathless layout for private routes (dashboard, watchlist, movie details).
 * Adds no URL segment. Unauthenticated visitors are sent to `/login` with the
 * originally requested URL preserved in `?redirect=`.
 */
export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ location }) => {
    if (!getSession().isAuthenticated) {
      throw redirect({ to: '/login', search: { redirect: location.href } })
    }
  },
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  return <Outlet />
}
