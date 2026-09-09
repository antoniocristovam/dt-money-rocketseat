import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import { NotFoundPage } from '@/modules/not-found/pages/not-found'
import { AppLayout } from '@/widgets/app-layout'

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: () => (
    <AppLayout>
      <NotFoundPage />
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
