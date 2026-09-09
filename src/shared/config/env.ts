import { z } from 'zod'

const envSchema = z.object({
  VITE_TMDB_BASE_URL: z.url(),
  VITE_TMDB_ACCESS_TOKEN: z
    .string()
    .min(1, 'VITE_TMDB_ACCESS_TOKEN is required'),
  VITE_TMDB_IMAGE_BASE_URL: z.url(),
})

const parsed = envSchema.safeParse(import.meta.env)

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
    .join('\n')
  throw new Error(
    `Invalid environment variables. Check your .env file:\n${issues}`,
  )
}

export const env = parsed.data

export type Env = typeof env
