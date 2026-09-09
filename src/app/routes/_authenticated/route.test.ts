import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getSession } from '@/features/auth'

import { Route as PublicRoute } from '../_public/route'

import { Route as AuthenticatedRoute } from './route'

vi.mock('@/features/auth', () => ({ getSession: vi.fn() }))

const mockedGetSession = vi.mocked(getSession)

/**
 * Runs a route's `beforeLoad` and returns the options of the thrown redirect
 * (`redirect()` throws a `Response` whose target lives on `.options`), or
 * `undefined` when the guard lets the navigation through.
 */
function runGuard(
  route: typeof AuthenticatedRoute | typeof PublicRoute,
  ctx: { location: { href: string } },
): { to?: string; search?: Record<string, unknown> } | undefined {
  try {
    route.options.beforeLoad?.(ctx as never)
    return undefined
  } catch (redirect) {
    return (
      redirect as { options: { to?: string; search?: Record<string, unknown> } }
    ).options
  }
}

beforeEach(() => {
  mockedGetSession.mockReset()
})

describe('guard de rota', () => {
  it('_authenticated redireciona para /login quando não há sessão', () => {
    mockedGetSession.mockReturnValue({ isAuthenticated: false, user: null })

    const redirect = runGuard(AuthenticatedRoute, {
      location: { href: '/watchlist' },
    })

    expect(redirect).toMatchObject({
      to: '/login',
      search: { redirect: '/watchlist' },
    })
  })

  it('_authenticated deixa passar quando há sessão', () => {
    mockedGetSession.mockReturnValue({
      isAuthenticated: true,
      user: { email: 'a@b.com', name: 'a' },
    })

    expect(
      runGuard(AuthenticatedRoute, { location: { href: '/' } }),
    ).toBeUndefined()
  })

  it('_public manda o usuário logado de volta pra "/"', () => {
    mockedGetSession.mockReturnValue({
      isAuthenticated: true,
      user: { email: 'a@b.com', name: 'a' },
    })

    expect(
      runGuard(PublicRoute, { location: { href: '/login' } }),
    ).toMatchObject({ to: '/' })
  })
})
