import { createFileRoute } from '@tanstack/react-router'

import { dashboardSearchSchema } from '@/modules/dashboard/model/search-schema'
import { DashboardPage } from '@/modules/dashboard/pages/dashboard-page'

export const Route = createFileRoute('/_authenticated/')({
  validateSearch: dashboardSearchSchema,
  component: DashboardPage,
})
