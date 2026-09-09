import { toast } from 'sonner'

import { HttpError } from '@/shared/api/http-error'

const DEFAULT_ERROR_MESSAGE = 'Algo deu errado. Tente novamente.'

export function resolveErrorMessage(
  error: unknown,
  fallback: string = DEFAULT_ERROR_MESSAGE,
): string {
  if (error instanceof HttpError) {
    const payload = error.payload
    if (payload && typeof payload === 'object' && 'status_message' in payload) {
      const message = (payload as { status_message?: unknown }).status_message
      if (typeof message === 'string' && message.trim()) return message
    }
    return error.message
  }
  if (error instanceof Error && error.message.trim()) return error.message
  return fallback
}

export const notify = {
  info: (message: string) => toast.info(message),
  error: (message: string) => toast.error(message),
  warning: (message: string) => toast.warning(message),
  success: (message: string) => toast.success(message),
  /** Toast a caught error, deriving the message with {@link resolveErrorMessage}. */
  fromError: (error: unknown, fallback?: string) =>
    toast.error(resolveErrorMessage(error, fallback)),
}
