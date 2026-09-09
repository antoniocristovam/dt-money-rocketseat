import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useSearchInput } from './use-search-input'

describe('useSearchInput (bind input ↔ URL com debounce)', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('propaga o valor sem espaços após o debounce e sinaliza o estado pendente', () => {
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

  it('propaga undefined quando o campo é limpo', () => {
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

  it('sincroniza uma mudança externa da URL de volta pro campo sem re-propagar', () => {
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
