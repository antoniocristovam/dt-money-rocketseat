import { describe, expect, it } from 'vitest'

import { dashboardSearchSchema } from './search-schema'

describe('dashboardSearchSchema (filtros da URL)', () => {
  it('assume page 1 e deixa os filtros indefinidos', () => {
    expect(dashboardSearchSchema.parse({})).toEqual({ page: 1 })
  })

  it('mantém filtros válidos', () => {
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

  it('usa o fallback em vez de lançar erro com valores inválidos', () => {
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

  it('descarta um texto de busca vazio', () => {
    expect(dashboardSearchSchema.parse({ q: '   ' }).q).toBeUndefined()
  })
})
