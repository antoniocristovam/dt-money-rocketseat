import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { useSessionStore } from '@/features/auth'
import { useWatchlistStore } from '@/features/watchlist'

import { AppLayout } from './app-layout'

const navigate = vi.fn()
vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => navigate,
  Link: ({ children }: { children: ReactNode }) => <a>{children}</a>,
}))

afterEach(() => {
  useSessionStore.setState({ token: null, user: null })
  useWatchlistStore.setState({ items: [] })
})

describe('AppLayout (casca do app)', () => {
  it('esconde o menu do usuário quando deslogado', () => {
    render(<AppLayout>content</AppLayout>)
    expect(
      screen.queryByRole('button', { name: /menu do usuário/i }),
    ).not.toBeInTheDocument()
  })

  it('desloga e redireciona para /login', async () => {
    const user = userEvent.setup()
    useSessionStore.getState().signIn({ email: 'a@b.com', name: 'a' })
    render(<AppLayout>content</AppLayout>)

    await user.click(screen.getByRole('button', { name: /menu do usuário/i }))
    await user.click(screen.getByRole('menuitem', { name: /sair/i }))

    expect(useSessionStore.getState().user).toBeNull()
    expect(navigate).toHaveBeenCalledWith({ to: '/login' })
  })
})
