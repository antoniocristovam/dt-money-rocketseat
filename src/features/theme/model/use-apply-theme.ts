import { useEffect } from 'react'

import { useTheme } from './use-theme'

/**
 * Side-effect hook: keeps the `<html>` element's `dark` class in sync with the
 * resolved theme. Mounted once, near the app root.
 */
export function useApplyTheme(): void {
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', resolvedTheme === 'dark')
    root.style.colorScheme = resolvedTheme
  }, [resolvedTheme])
}
