import { createRouter } from '@tanstack/react-router'

import { NotFoundPage } from '@/pages/not-found/not-found'

import { routeTree } from '../routes/routeTree.gen'

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultNotFoundComponent: NotFoundPage,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
