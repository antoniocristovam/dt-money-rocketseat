import { createFileRoute } from '@tanstack/react-router'

import { WatchlistPage } from '@/modules/watchlist/pages/watchlist-page'

export const Route = createFileRoute('/_authenticated/watchlist')({
  component: WatchlistPage,
})
