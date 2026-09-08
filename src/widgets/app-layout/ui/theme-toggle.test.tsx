import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'

import { useApplyTheme, useThemeStore } from '@/features/theme'

import { ThemeToggle } from './theme-toggle'

function Harness() {
  useApplyTheme()
  return <ThemeToggle />
}

afterEach(() => {
  useThemeStore.setState({ theme: 'system' })
  document.documentElement.classList.remove('dark')
})

describe('ThemeToggle', () => {
  it('switches to dark and applies the class to <html>', async () => {
    const user = userEvent.setup()
    render(<Harness />)

    await user.click(screen.getByRole('button', { name: /alternar tema/i }))
    await user.click(screen.getByRole('menuitem', { name: /escuro/i }))

    expect(useThemeStore.getState().theme).toBe('dark')
    expect(document.documentElement).toHaveClass('dark')
  })

  it('switches back to light and removes the class', async () => {
    const user = userEvent.setup()
    useThemeStore.setState({ theme: 'dark' })
    render(<Harness />)

    await user.click(screen.getByRole('button', { name: /alternar tema/i }))
    await user.click(screen.getByRole('menuitem', { name: /claro/i }))

    expect(useThemeStore.getState().theme).toBe('light')
    expect(document.documentElement).not.toHaveClass('dark')
  })
})
