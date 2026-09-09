import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { LoginPage } from '@/modules/login/pages/login-page'

const loginSearchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/_public/login')({
  validateSearch: loginSearchSchema,
  component: LoginRoute,
})

function LoginRoute() {
  const { redirect } = Route.useSearch()
  return <LoginPage redirectTo={redirect} />
}
