import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

import { getSession } from '@/features/auth'

/**
 * Pathless layout for public routes (login). Authenticated users are bounced
 * to the dashboard. Adds no URL segment.
 */
export const Route = createFileRoute('/_public')({
  beforeLoad: () => {
    if (getSession().isAuthenticated) {
      throw redirect({ to: '/' })
    }
  },
  component: PublicLayout,
})

function PublicLayout() {
  return <Outlet />
}
