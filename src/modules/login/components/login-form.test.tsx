import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { useSessionStore } from '@/features/auth'

import { LoginForm } from './login-form'

vi.mock('@/shared/lib/notify', () => ({
  notify: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
    fromError: vi.fn(),
  },
}))

afterEach(() => {
  useSessionStore.setState({ token: null, user: null })
})

describe('LoginForm (formulário de login)', () => {
  it('mostra os erros de validação e não loga em um submit inválido', async () => {
    const user = userEvent.setup()
    const onSuccess = vi.fn()
    render(<LoginForm onSuccess={onSuccess} />)

    await user.click(screen.getByRole('button', { name: /entrar/i }))

    expect(await screen.findByText(/e-mail válido/i)).toBeInTheDocument()
    expect(screen.getByText(/mais de 6 caracteres/i)).toBeInTheDocument()
    expect(onSuccess).not.toHaveBeenCalled()
    expect(useSessionStore.getState().user).toBeNull()
  })

  it('loga e chama onSuccess com credenciais válidas', async () => {
    const user = userEvent.setup()
    const onSuccess = vi.fn()
    render(<LoginForm onSuccess={onSuccess} />)

    await user.type(screen.getByLabelText(/e-mail/i), 'curador@cinedash.com')
    await user.type(screen.getByLabelText(/senha/i), 'segredo7')
    await user.click(screen.getByRole('button', { name: /entrar/i }))

    await vi.waitFor(() => expect(onSuccess).toHaveBeenCalledOnce(), {
      timeout: 2000,
    })
    expect(useSessionStore.getState().user).toEqual({
      email: 'curador@cinedash.com',
      name: 'curador',
    })
  })
})
