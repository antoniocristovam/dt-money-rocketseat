export interface DebouncedFunction<Args extends unknown[]> {
  (...args: Args): void
  cancel: () => void
}

export function debounce<Args extends unknown[]>(
  fn: (...args: Args) => void,
  delay: number,
): DebouncedFunction<Args> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  const debounced = (...args: Args): void => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      timeoutId = undefined
      fn(...args)
    }, delay)
  }

  debounced.cancel = (): void => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId)
      timeoutId = undefined
    }
  }

  return debounced
}
