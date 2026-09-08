import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useSearchInput } from './use-search-input'

describe('useSearchInput', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('commits the trimmed value after the debounce and reports pending state', () => {
    const onCommit = vi.fn()
    const { result } = renderHook(() => useSearchInput(undefined, onCommit))

    act(() => {
      result.current.setText('  matrix  ')
    })
    expect(result.current.isDebouncing).toBe(true)
    expect(onCommit).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(400)
    })
    expect(result.current.isDebouncing).toBe(false)
    expect(onCommit).toHaveBeenCalledWith('matrix')
  })

  it('commits undefined when the field is cleared', () => {
    const onCommit = vi.fn()
    const { result } = renderHook(() => useSearchInput('matrix', onCommit))

    act(() => {
      result.current.setText('')
    })
    act(() => {
      vi.advanceTimersByTime(400)
    })

    expect(onCommit).toHaveBeenCalledWith(undefined)
  })

  it('syncs an external URL change back into the field without re-committing', () => {
    const onCommit = vi.fn()
    const { result, rerender } = renderHook<
      ReturnType<typeof useSearchInput>,
      { q: string | undefined }
    >(({ q }) => useSearchInput(q, onCommit), { initialProps: { q: 'matrix' } })

    rerender({ q: undefined })
    act(() => {
      vi.advanceTimersByTime(400)
    })

    expect(result.current.text).toBe('')
    expect(onCommit).not.toHaveBeenCalled()
  })
})
