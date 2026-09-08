import { useNavigate } from '@tanstack/react-router'
import { FilmIcon } from 'lucide-react'

import { LoginForm } from '@/features/auth'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card'

interface LoginPageProps {
  redirectTo?: string
}

export const LoginPage = ({ redirectTo }: LoginPageProps) => {
  const navigate = useNavigate()

  return (
    <section className="mx-auto flex min-h-[70svh] max-w-sm flex-col justify-center">
      <Card>
        <CardHeader>
          <span className="flex items-center gap-2 font-semibold tracking-tight">
            <FilmIcon className="size-5 text-primary" />
            CineDash
          </span>
          <CardTitle>Entrar</CardTitle>
          <CardDescription>
            Acesso restrito a curadores. Use qualquer e-mail válido e uma senha
            com mais de 6 caracteres.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm
            onSuccess={() => {
              void navigate({ to: redirectTo ?? '/' })
            }}
          />
        </CardContent>
      </Card>
    </section>
  )
}
