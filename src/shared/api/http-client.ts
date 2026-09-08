import { env } from '@/shared/config/env'

import { HttpError } from './http-error'

type QueryValue = string | number | boolean | null | undefined

export interface HttpRequestOptions extends Omit<RequestInit, 'body'> {
  /** Query params appended to the URL; nullish values are skipped. */
  params?: Record<string, QueryValue>
  /** JSON body — serialized automatically. */
  body?: unknown
}

function buildUrl(path: string, params?: Record<string, QueryValue>): string {
  const url = new URL(
    path.replace(/^\//, ''),
    `${env.VITE_TMDB_BASE_URL.replace(/\/$/, '')}/`,
  )

  for (const [key, value] of Object.entries(params ?? {})) {
    if (value !== null && value !== undefined) {
      url.searchParams.set(key, String(value))
    }
  }

  return url.toString()
}

/**
 * Typed `fetch` wrapper for the TMDB API. Injects auth + JSON headers, builds
 * query strings, and normalizes failures into {@link HttpError}. All data
 * access (services) should go through this rather than calling `fetch` directly.
 */
export async function httpClient<T>(
  path: string,
  { params, body, headers, ...init }: HttpRequestOptions = {},
): Promise<T> {
  const response = await fetch(buildUrl(path, params), {
    ...init,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${env.VITE_TMDB_ACCESS_TOKEN}`,
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  const payload: unknown = await response.json().catch(() => null)

  if (!response.ok) {
    throw new HttpError(response.status, response.statusText, payload)
  }

  return payload as T
}
