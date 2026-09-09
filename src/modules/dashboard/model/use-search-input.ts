import { useEffect, useRef, useState } from 'react'

import { useDebouncedValue } from '@/shared/lib/use-debounced-value'

export function useSearchInput(
  urlQuery: string | undefined,
  onCommit: (query: string | undefined) => void,
) {
  const [text, setText] = useState(urlQuery ?? '')
  const debounced = useDebouncedValue(text, 400)
  const lastCommitted = useRef(urlQuery)

  useEffect(() => {
    if (urlQuery !== lastCommitted.current) {
      lastCommitted.current = urlQuery
      setText(urlQuery ?? '')
    }
  }, [urlQuery])

  useEffect(() => {
    const next = debounced.trim() || undefined
    if (next !== lastCommitted.current) {
      lastCommitted.current = next
      onCommit(next)
    }
  }, [debounced, onCommit])

  /** `true` while the user is still typing and the debounce hasn't fired. */
  const isDebouncing = text.trim() !== debounced.trim()

  return { text, setText, isDebouncing }
}
