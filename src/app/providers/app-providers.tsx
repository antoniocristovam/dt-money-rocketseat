import type { ReactNode } from 'react'

import { useApplyTheme, useTheme } from '@/features/theme'
import { Toaster } from '@/shared/ui/sonner'

import { QueryProvider } from './query-provider'

function ThemedToaster() {
  const { resolvedTheme } = useTheme()
  return <Toaster theme={resolvedTheme} position="top-right" richColors />
}

export function AppProviders({ children }: { children: ReactNode }) {
  useApplyTheme()

  return (
    <QueryProvider>
      {children}
      <ThemedToaster />
    </QueryProvider>
  )
}
