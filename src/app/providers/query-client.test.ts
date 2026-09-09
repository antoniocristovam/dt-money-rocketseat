import { afterEach, describe, expect, it, vi } from 'vitest'

import { HttpError } from '@/shared/api/http-error'
import { notify } from '@/shared/lib/notify'

import { createQueryClient } from './query-client'

vi.mock('@/shared/lib/notify', () => ({
  notify: { fromError: vi.fn() },
}))

const fromError = vi.mocked(notify.fromError)

afterEach(() => {
  vi.clearAllMocks()
})

async function runFailingQuery(
  error: unknown,
  meta?: { skipErrorToast?: boolean },
) {
  const client = createQueryClient()
  await client
    .fetchQuery({
      queryKey: ['test', crypto.randomUUID()],
      queryFn: () => Promise.reject(error),
      retry: false,
      meta,
    })
    .catch(() => undefined)
  // let the cache dispatch its onError microtask settle
  await Promise.resolve()
}

describe('toast de erro do createQueryClient', () => {
  it('exibe um toast quando uma query falha', async () => {
    const error = new HttpError(503, 'Service Unavailable', {
      status_message: 'Servidor indisponível.',
    })
    await runFailingQuery(error)
    expect(fromError).toHaveBeenCalledWith(error)
  })

  it('fica em silêncio em um 404', async () => {
    await runFailingQuery(new HttpError(404, 'Not Found', null))
    expect(fromError).not.toHaveBeenCalled()
  })

  it('respeita meta.skipErrorToast', async () => {
    await runFailingQuery(new Error('boom'), { skipErrorToast: true })
    expect(fromError).not.toHaveBeenCalled()
  })
})
