import { createFileRoute } from '@tanstack/react-router'

import { NotFoundPage } from '@/modules/not-found/pages/not-found'

export const Route = createFileRoute('/$')({
  component: NotFoundPage,
})
