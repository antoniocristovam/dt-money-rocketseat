import { describe, expect, it } from 'vitest'

import { getPaginationRange } from './pagination-range'

describe('getPaginationRange', () => {
  it('lists every page when they all fit', () => {
    expect(getPaginationRange({ page: 1, totalPages: 5 })).toEqual([
      1, 2, 3, 4, 5,
    ])
  })

  it('shows a right ellipsis near the start', () => {
    expect(getPaginationRange({ page: 2, totalPages: 500 })).toEqual([
      1,
      2,
      3,
      4,
      5,
      'ellipsis',
      500,
    ])
  })

  it('shows a left ellipsis near the end', () => {
    expect(getPaginationRange({ page: 499, totalPages: 500 })).toEqual([
      1,
      'ellipsis',
      496,
      497,
      498,
      499,
      500,
    ])
  })

  it('shows both ellipses in the middle', () => {
    expect(getPaginationRange({ page: 250, totalPages: 500 })).toEqual([
      1,
      'ellipsis',
      249,
      250,
      251,
      'ellipsis',
      500,
    ])
  })
})
