import { createFileRoute } from '@tanstack/react-router'

import { DashboardPage } from '@/modules/dashboard/pages/dashboard-page'

export const Route = createFileRoute('/_authenticated/')({
  component: DashboardPage,
})
