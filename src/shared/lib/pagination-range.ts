export type PaginationItem = number | 'ellipsis'

interface PaginationRangeOptions {
  page: number
  totalPages: number
  /** How many page numbers to show on each side of the current page. */
  siblings?: number
}

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
}

/**
 * Builds the list of page buttons for a numbered pager: always first and last,
 * a window of `siblings` around the current page, and `'ellipsis'` markers for
 * the gaps. Falls back to a plain `1..totalPages` list when everything fits.
 */
export function getPaginationRange({
  page,
  totalPages,
  siblings = 1,
}: PaginationRangeOptions): PaginationItem[] {
  // first + last + current + 2*siblings + 2 ellipsis
  const maxSlots = siblings * 2 + 5

  if (totalPages <= maxSlots) {
    return range(1, totalPages)
  }

  const leftSibling = Math.max(page - siblings, 1)
  const rightSibling = Math.min(page + siblings, totalPages)

  const showLeftEllipsis = leftSibling > 2
  const showRightEllipsis = rightSibling < totalPages - 1

  if (!showLeftEllipsis && showRightEllipsis) {
    return [...range(1, 3 + siblings * 2), 'ellipsis', totalPages]
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    return [
      1,
      'ellipsis',
      ...range(totalPages - (2 + siblings * 2), totalPages),
    ]
  }

  return [
    1,
    'ellipsis',
    ...range(leftSibling, rightSibling),
    'ellipsis',
    totalPages,
  ]
}
