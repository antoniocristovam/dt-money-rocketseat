import axios from 'axios'

import { env } from '@/shared/config/env'

import { HttpError } from './http-error'

/**
 * Single axios instance for the TMDB REST API. Base URL and the Bearer v4 token
 * are set once here; callers only pass the path and `params`.
 */
export const tmdbClient = axios.create({
  baseURL: env.VITE_TMDB_BASE_URL,
  headers: { Authorization: `Bearer ${env.VITE_TMDB_ACCESS_TOKEN}` },
})

/**
 * Normalise every failure into an {@link HttpError} so the rest of the app never
 * has to know about axios. Keeps the status and the response body (the TMDB
 * `status_message` lives there) for the error toast and the 404 guards.
 */
tmdbClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response) {
      throw new HttpError(
        error.response.status,
        error.response.statusText,
        error.response.data as unknown,
      )
    }
    const message = error instanceof Error ? error.message : 'Erro de rede'
    throw new HttpError(0, message, null)
  },
)
