import { useSyncExternalStore } from 'react'

import {
  type ResolvedTheme,
  type Theme,
  resolveTheme,
  useThemeStore,
} from './theme-store'

const MEDIA_QUERY = '(prefers-color-scheme: dark)'

function subscribeToSystemTheme(onChange: () => void): () => void {
  if (typeof window === 'undefined') return () => {}
  const media = window.matchMedia(MEDIA_QUERY)
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}

function getSystemSnapshot(): boolean {
  return window.matchMedia(MEDIA_QUERY).matches
}

/**
 * Reads the persisted theme plus the live OS preference and returns both the
 * user's choice and the concrete theme currently applied.
 */
export function useTheme(): {
  theme: Theme
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
} {
  const theme = useThemeStore((state) => state.theme)
  const setTheme = useThemeStore((state) => state.setTheme)

  // Re-render when the OS preference flips while on `system`.
  useSyncExternalStore(subscribeToSystemTheme, getSystemSnapshot, () => false)

  return { theme, resolvedTheme: resolveTheme(theme), setTheme }
}
