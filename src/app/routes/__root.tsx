import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import { NotFound } from '@/shared/components/notFoundPage'
import { AppLayout } from '@/widgets/app-layout'

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: () => (
    <AppLayout>
      <NotFound />
    </AppLayout>
  ),
})

function RootComponent() {
  return (
    <AppLayout>
      <Outlet />
      {import.meta.env.DEV ? (
        <TanStackRouterDevtools position="bottom-left" />
      ) : null}
    </AppLayout>
  )
}
