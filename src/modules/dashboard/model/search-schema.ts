import { z } from 'zod'

const CURRENT_YEAR = new Date().getFullYear()

/**
 * URL search params for the discovery dashboard. Every field is optional and
 * `.catch()`-guarded so a hand-edited URL never throws — it falls back instead.
 */
export const dashboardSearchSchema = z.object({
  page: z.number().int().min(1).max(500).catch(1).default(1),
  q: z.string().trim().min(1).optional().catch(undefined),
  genre: z.number().int().positive().optional().catch(undefined),
  year: z
    .number()
    .int()
    .min(1874)
    .max(CURRENT_YEAR + 2)
    .optional()
    .catch(undefined),
  minRating: z.number().min(0).max(10).optional().catch(undefined),
})

export type DashboardSearch = z.infer<typeof dashboardSearchSchema>

export const RATING_OPTIONS = [
  { value: 9, label: '9+' },
  { value: 8, label: '8+' },
  { value: 7, label: '7+' },
  { value: 6, label: '6+' },
  { value: 5, label: '5+' },
] as const

export const YEAR_OPTIONS = Array.from(
  { length: CURRENT_YEAR - 1950 + 1 },
  (_, index) => CURRENT_YEAR - index,
)
