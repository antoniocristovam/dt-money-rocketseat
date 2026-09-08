import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { useSessionStore } from '../model/session-store'

import { LoginForm } from './login-form'

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

afterEach(() => {
  useSessionStore.setState({ token: null, user: null })
})

describe('LoginForm', () => {
  it('shows validation errors and does not sign in on invalid submit', async () => {
    const user = userEvent.setup()
    const onSuccess = vi.fn()
    render(<LoginForm onSuccess={onSuccess} />)

    await user.click(screen.getByRole('button', { name: /entrar/i }))

    expect(await screen.findByText(/e-mail válido/i)).toBeInTheDocument()
    expect(screen.getByText(/mais de 6 caracteres/i)).toBeInTheDocument()
    expect(onSuccess).not.toHaveBeenCalled()
    expect(useSessionStore.getState().user).toBeNull()
  })

  it('signs in and calls onSuccess with valid credentials', async () => {
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
