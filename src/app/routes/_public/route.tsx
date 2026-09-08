import { Outlet, createFileRoute } from '@tanstack/react-router'

/**
 * Pathless layout for public routes (login, etc.) — accessible without a
 * session. Adds no URL segment.
 */
export const Route = createFileRoute('/_public')({
  component: PublicLayout,
})

function PublicLayout() {
  return <Outlet />
}
