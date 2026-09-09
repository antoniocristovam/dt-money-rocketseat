import { useSessionStore } from './session-store'

export function useSession() {
  const user = useSessionStore((state) => state.user)
  const token = useSessionStore((state) => state.token)
  const signOut = useSessionStore((state) => state.signOut)

  return { isAuthenticated: Boolean(token && user), user, signOut }
}
