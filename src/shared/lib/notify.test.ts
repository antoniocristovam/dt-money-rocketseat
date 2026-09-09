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
  it('prioriza o status_message do TMDB no payload do HttpError', () => {
    const error = new HttpError(404, 'Not Found', {
      status_message: 'The resource you requested could not be found.',
    })
    expect(resolveErrorMessage(error)).toBe(
      'The resource you requested could not be found.',
    )
  })

  it('usa a mensagem do HttpError quando o payload não tem uma', () => {
    expect(resolveErrorMessage(new HttpError(500, 'Server Error', null))).toBe(
      'HTTP 500 Server Error',
    )
  })

  it('usa a mensagem de um Error genérico', () => {
    expect(resolveErrorMessage(new Error('boom'))).toBe('boom')
  })

  it('usa o fallback para valores que não são Error', () => {
    expect(resolveErrorMessage('nope', 'Falha ao carregar')).toBe(
      'Falha ao carregar',
    )
  })
})

describe('notify', () => {
  it('fromError exibe um toast com a mensagem resolvida', () => {
    notify.fromError(new Error('sem rede'))
    expect(toast.error).toHaveBeenCalledWith('sem rede')
  })

  it('encaminha as variantes simples pro sonner', () => {
    notify.success('ok')
    expect(toast.success).toHaveBeenCalledWith('ok')
  })
})
