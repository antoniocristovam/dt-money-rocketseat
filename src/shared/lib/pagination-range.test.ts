import { describe, expect, it } from 'vitest'

import { getPaginationRange } from './pagination-range'

describe('getPaginationRange', () => {
  it('lista todas as páginas quando cabem', () => {
    expect(getPaginationRange({ page: 1, totalPages: 5 })).toEqual([
      1, 2, 3, 4, 5,
    ])
  })

  it('mostra reticências à direita perto do início', () => {
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

  it('mostra reticências à esquerda perto do fim', () => {
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

  it('mostra reticências dos dois lados no meio', () => {
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
