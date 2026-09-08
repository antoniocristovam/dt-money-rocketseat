import { useEffect, useMemo, useState } from 'react'

import { debounce } from './debounce'

/**
 * Returns `value` delayed by `delay` ms, collapsing rapid changes into one
 * update. Used to throttle the search input against the API.
 */
export function useDebouncedValue<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value)

  const update = useMemo(() => debounce(setDebounced, delay), [delay])

  useEffect(() => {
    update(value)
    return update.cancel
  }, [value, update])

  return debounced
}
