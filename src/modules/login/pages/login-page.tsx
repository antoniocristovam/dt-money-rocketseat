import { useNavigate } from '@tanstack/react-router'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card'
import { Logo } from '@/shared/ui/logo'

import { LoginForm } from '../components/login-form'

// interface
interface LoginPageProps {
  redirectTo?: string
}

export const LoginPage = ({ redirectTo }: LoginPageProps) => {
  // hooks
  const navigate = useNavigate()

  return (
    <section className="mx-auto flex min-h-[70svh] max-w-sm flex-col justify-center">
      <Card>
        <CardHeader>
          <Logo className="mx-auto mb-3 block h-7" />
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
