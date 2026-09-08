import {
  CalendarIcon,
  Loader2Icon,
  StarIcon,
  TagsIcon,
  XIcon,
} from 'lucide-react'
import type { ReactNode } from 'react'

import { useGenresQuery } from '@/entities/movie'
import { Button } from '@/shared/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'

import { RATING_OPTIONS, YEAR_OPTIONS } from '../model/search-schema'
import { useDashboardFilters } from '../model/use-dashboard-filters'

const ALL = 'all'

/** `"all"` → `undefined`, otherwise the parsed number. */
function toValue(raw: string): number | undefined {
  return raw === ALL ? undefined : Number(raw)
}

function TriggerLabel({
  icon,
  placeholder,
}: {
  icon: ReactNode
  placeholder: string
}) {
  return (
    <span className="flex items-center gap-2 truncate">
      {icon}
      <SelectValue placeholder={placeholder} />
    </span>
  )
}

export function MovieFilters() {
  const { filters, setFilters, resetFilters, hasActiveFilters } =
    useDashboardFilters()
  const genresQuery = useGenresQuery()
  const genres = genresQuery.data ?? []

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select
        value={filters.genre ? String(filters.genre) : ALL}
        onValueChange={(value) => setFilters({ genre: toValue(value) })}
        disabled={genresQuery.isLoading}
      >
        <SelectTrigger className="min-w-[168px]" aria-label="Gênero">
          <TriggerLabel
            placeholder="Gênero"
            icon={
              genresQuery.isLoading ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                <TagsIcon />
              )
            }
          />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>Todos os gêneros</SelectItem>
          {genresQuery.isError ? (
            <p className="px-2 py-1.5 text-sm text-muted-foreground">
              Não foi possível carregar os gêneros.
            </p>
          ) : null}
          {genres.map((genre) => (
            <SelectItem key={genre.id} value={String(genre.id)}>
              {genre.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.year ? String(filters.year) : ALL}
        onValueChange={(value) => setFilters({ year: toValue(value) })}
      >
        <SelectTrigger className="min-w-[150px]" aria-label="Ano de lançamento">
          <TriggerLabel placeholder="Ano" icon={<CalendarIcon />} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>Qualquer ano</SelectItem>
          {YEAR_OPTIONS.map((year) => (
            <SelectItem key={year} value={String(year)}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.minRating ? String(filters.minRating) : ALL}
        onValueChange={(value) => setFilters({ minRating: toValue(value) })}
      >
        <SelectTrigger className="min-w-[160px]" aria-label="Nota mínima">
          <TriggerLabel placeholder="Nota mínima" icon={<StarIcon />} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>Qualquer nota</SelectItem>
          {RATING_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={String(option.value)}>
              {option.label} ou mais
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasActiveFilters ? (
        <Button variant="ghost" size="sm" onClick={resetFilters}>
          <XIcon className="size-4" />
          Limpar
        </Button>
      ) : null}
    </div>
  )
}
