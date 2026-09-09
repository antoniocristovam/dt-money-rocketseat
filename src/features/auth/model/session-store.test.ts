import { afterEach, describe, expect, it } from 'vitest'

import { getSession, useSessionStore } from './session-store'

afterEach(() => {
  useSessionStore.setState({ token: null, user: null })
})

describe('session-store', () => {
  it('começa deslogado', () => {
    expect(getSession().isAuthenticated).toBe(false)
  })

  it('signIn gera um token e guarda o usuário', () => {
    useSessionStore.getState().signIn({ email: 'a@b.com', name: 'a' })

    const state = useSessionStore.getState()
    expect(state.user).toEqual({ email: 'a@b.com', name: 'a' })
    expect(state.token).toEqual(expect.stringMatching(/^cinedash\./))
    expect(getSession().isAuthenticated).toBe(true)
  })

  it('signOut limpa a sessão', () => {
    useSessionStore.getState().signIn({ email: 'a@b.com', name: 'a' })
    useSessionStore.getState().signOut()

    expect(getSession()).toEqual({ isAuthenticated: false, user: null })
  })

  it('persiste a sessão na chave do storage', () => {
    useSessionStore.getState().signIn({ email: 'a@b.com', name: 'a' })
    expect(localStorage.getItem('cinedash:session')).toContain('a@b.com')
  })
})
