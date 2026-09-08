import { Outlet, createFileRoute } from '@tanstack/react-router'

/**
 * Pathless layout for private routes (dashboard, watchlist, movie details).
 * Adds no URL segment.
 *
 * TODO(parte 2): guardar a sessão simulada aqui —
 *   beforeLoad: () => {
 *     if (!getSession()) throw redirect({ to: '/login' })
 *   }
 */
export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  return <Outlet />
}
