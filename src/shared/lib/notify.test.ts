import { describe, expect, it, vi } from 'vitest'

import { HttpError } from '@/shared/api/http-error'

import { notify, resolveErrorMessage } from './notify'

const toast = vi.hoisted(() => ({
  success: vi.fn(),
  info: vi.fn(),
  warning: vi.fn(),
  error: vi.fn(),
}))
vi.mock('sonner', () => ({ toast }))

describe('resolveErrorMessage', () => {
  it('prefers the TMDB `status_message` from an HttpError payload', () => {
    const error = new HttpError(404, 'Not Found', {
      status_message: 'The resource you requested could not be found.',
    })
    expect(resolveErrorMessage(error)).toBe(
      'The resource you requested could not be found.',
    )
  })

  it('falls back to the HttpError message when the payload has none', () => {
    expect(resolveErrorMessage(new HttpError(500, 'Server Error', null))).toBe(
      'HTTP 500 Server Error',
    )
  })

  it('uses a generic Error message', () => {
    expect(resolveErrorMessage(new Error('boom'))).toBe('boom')
  })

  it('uses the fallback for non-errors', () => {
    expect(resolveErrorMessage('nope', 'Falha ao carregar')).toBe(
      'Falha ao carregar',
    )
  })
})

describe('notify', () => {
  it('fromError toasts the resolved message', () => {
    notify.fromError(new Error('sem rede'))
    expect(toast.error).toHaveBeenCalledWith('sem rede')
  })

  it('forwards the simple variants to sonner', () => {
    notify.success('ok')
    expect(toast.success).toHaveBeenCalledWith('ok')
  })
})
