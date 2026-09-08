import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { useSessionStore } from '@/features/auth'

import { AppLayout } from './app-layout'

const navigate = vi.fn()
vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => navigate,
}))

afterEach(() => {
  useSessionStore.setState({ token: null, user: null })
})

describe('AppLayout', () => {
  it('hides the user menu when signed out', () => {
    render(<AppLayout>content</AppLayout>)
    expect(
      screen.queryByRole('button', { name: /menu do usuário/i }),
    ).not.toBeInTheDocument()
  })

  it('signs out and redirects to /login', async () => {
    const user = userEvent.setup()
    useSessionStore.getState().signIn({ email: 'a@b.com', name: 'a' })
    render(<AppLayout>content</AppLayout>)

    await user.click(screen.getByRole('button', { name: /menu do usuário/i }))
    await user.click(screen.getByRole('menuitem', { name: /sair/i }))

    expect(useSessionStore.getState().user).toBeNull()
    expect(navigate).toHaveBeenCalledWith({ to: '/login' })
  })
})
