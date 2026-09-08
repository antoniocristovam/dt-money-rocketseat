/** Error thrown by {@link httpClient} for any non-2xx response. */
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
