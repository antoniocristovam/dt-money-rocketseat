import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { type LoginFormValues, loginSchema } from './login-schema'
import { useSessionStore } from './session-store'

// simular latência de rede para login (:
const FAKE_LATENCY_MS = 500

interface UseLoginOptions {
  onSuccess: () => void
}

export function useLogin({ onSuccess }: UseLoginOptions) {
  const signIn = useSessionStore((state) => state.signIn)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const submit = form.handleSubmit(async ({ email }) => {
    await new Promise((resolve) => setTimeout(resolve, FAKE_LATENCY_MS))
    signIn({ email, name: email.split('@')[0] ?? email })
    toast.success('Bem-vindo(a) ao CineDash')
    onSuccess()
  })

  return { form, submit, isSubmitting: form.formState.isSubmitting }
}
