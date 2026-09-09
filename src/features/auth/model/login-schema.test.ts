import { describe, expect, it } from 'vitest'

import { loginSchema } from './login-schema'

describe('loginSchema', () => {
  it('aceita e-mail válido e senha com mais de 6 caracteres', () => {
    const result = loginSchema.safeParse({
      email: 'curador@cinedash.com',
      password: 'segredo7',
    })
    expect(result.success).toBe(true)
  })

  it('rejeita e-mail inválido', () => {
    const result = loginSchema.safeParse({
      email: 'not-an-email',
      password: 'segredo7',
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.path).toEqual(['email'])
  })

  it('rejeita senha com 6 caracteres ou menos', () => {
    expect(
      loginSchema.safeParse({ email: 'a@b.com', password: '123456' }).success,
    ).toBe(false)
    expect(
      loginSchema.safeParse({ email: 'a@b.com', password: '1234567' }).success,
    ).toBe(true)
  })
})
