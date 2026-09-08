import { describe, expect, it } from 'vitest'

import { loginSchema } from './login-schema'

describe('loginSchema', () => {
  it('accepts a valid email and a password longer than 6 chars', () => {
    const result = loginSchema.safeParse({
      email: 'curador@cinedash.com',
      password: 'segredo7',
    })
    expect(result.success).toBe(true)
  })

  it('rejects an invalid email', () => {
    const result = loginSchema.safeParse({
      email: 'not-an-email',
      password: 'segredo7',
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.path).toEqual(['email'])
  })

  it('rejects a password of 6 chars or fewer', () => {
    expect(
      loginSchema.safeParse({ email: 'a@b.com', password: '123456' }).success,
    ).toBe(false)
    expect(
      loginSchema.safeParse({ email: 'a@b.com', password: '1234567' }).success,
    ).toBe(true)
  })
})
