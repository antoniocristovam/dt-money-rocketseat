/** Error thrown by {@link tmdbClient} for any failed request (non-2xx or network). */
export class HttpError extends Error {
  readonly status: number
  readonly payload: unknown

  constructor(status: number, statusText: string, payload: unknown) {
    super(`HTTP ${status} ${statusText}`)
    this.name = 'HttpError'
    this.status = status
    this.payload = payload
  }
}
