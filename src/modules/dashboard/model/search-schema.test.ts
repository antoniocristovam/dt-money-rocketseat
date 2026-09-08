import { describe, expect, it } from 'vitest'

import { dashboardSearchSchema } from './search-schema'

describe('dashboardSearchSchema', () => {
  it('defaults page to 1 and leaves filters undefined', () => {
    expect(dashboardSearchSchema.parse({})).toEqual({ page: 1 })
  })

  it('keeps valid filters', () => {
    expect(
      dashboardSearchSchema.parse({
        page: 3,
        q: 'matrix',
        genre: 28,
        year: 1999,
        minRating: 8,
      }),
    ).toEqual({ page: 3, q: 'matrix', genre: 28, year: 1999, minRating: 8 })
  })

  it('falls back instead of throwing on garbage values', () => {
    const parsed = dashboardSearchSchema.parse({
      page: -5,
      genre: 'abc',
      year: 3000,
      minRating: 99,
    })
    expect(parsed.page).toBe(1)
    expect(parsed.genre).toBeUndefined()
    expect(parsed.year).toBeUndefined()
    expect(parsed.minRating).toBeUndefined()
  })

  it('drops an empty search string', () => {
    expect(dashboardSearchSchema.parse({ q: '   ' }).q).toBeUndefined()
  })
})
