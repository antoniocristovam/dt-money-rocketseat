import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface SessionUser {
  email: string
  name: string
}

interface SessionState {
  token: string | null
  user: SessionUser | null
  /** Simulates a successful login: mints a fake token and stores the user. */
  signIn: (user: SessionUser) => void
  signOut: () => void
}

export const SESSION_STORAGE_KEY = 'cinedash:session'

function createFakeToken(): string {
  const random =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2)
  return `cinedash.${random}.${Date.now()}`
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      signIn: (user) => set({ token: createFakeToken(), user }),
      signOut: () => set({ token: null, user: null }),
    }),
    { name: SESSION_STORAGE_KEY },
  ),
)

export function getSession(): {
  isAuthenticated: boolean
  user: SessionUser | null
} {
  const { token, user } = useSessionStore.getState()
  return { isAuthenticated: Boolean(token && user), user }
}
