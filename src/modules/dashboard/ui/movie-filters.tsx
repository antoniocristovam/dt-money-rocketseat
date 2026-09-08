import { XIcon } from 'lucide-react'

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

export function MovieFilters() {
  const { filters, setFilters, resetFilters, hasActiveFilters } =
    useDashboardFilters()
  const { data: genres = [] } = useGenresQuery()

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select
        value={filters.genre ? String(filters.genre) : ALL}
        onValueChange={(value) => setFilters({ genre: toValue(value) })}
      >
        <SelectTrigger className="w-[150px]" aria-label="Gênero">
          <SelectValue placeholder="Gênero" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>Todos os gêneros</SelectItem>
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
        <SelectTrigger className="w-[120px]" aria-label="Ano de lançamento">
          <SelectValue placeholder="Ano" />
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
        <SelectTrigger className="w-[130px]" aria-label="Nota mínima">
          <SelectValue placeholder="Nota mínima" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>Qualquer nota</SelectItem>
          {RATING_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={String(option.value)}>
              {option.label}
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
