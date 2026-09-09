import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

import { cn } from '@/shared/lib/cn'
import { getPaginationRange } from '@/shared/lib/pagination-range'
import { Button } from '@/shared/ui/button'

import { useDashboardFilters } from '../model/use-dashboard-filters'

interface DashboardPaginationProps {
  totalPages: number
  disabled?: boolean
}

export function DashboardPagination({
  disabled,
  totalPages,
}: DashboardPaginationProps) {
  const { filters, setFilters } = useDashboardFilters()
  const page = filters.page

  if (totalPages <= 1) return null

  const goTo = (next: number) => setFilters({ page: next })
  const items = getPaginationRange({ page, totalPages, siblings: 1 })

  return (
    <div className="flex flex-col items-center gap-2">
      <nav
        className="flex flex-wrap items-center justify-center gap-1"
        aria-label="Paginação"
      >
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => goTo(page - 1)}
          disabled={disabled || page <= 1}
          aria-label="Página anterior"
        >
          <ChevronLeftIcon className="size-4" />
        </Button>

        {items.map((item, index) =>
          item === 'ellipsis' ? (
            <span
              key={`ellipsis-${index}`}
              className="px-1.5 text-muted-foreground"
              aria-hidden="true"
            >
              …
            </span>
          ) : (
            <Button
              key={item}
              variant={item === page ? 'default' : 'outline'}
              size="icon-sm"
              onClick={() => goTo(item)}
              disabled={disabled}
              aria-label={`Página ${item}`}
              aria-current={item === page ? 'page' : undefined}
              className={cn(
                'min-w-8 tabular-nums',
                item === page && 'pointer-events-none',
              )}
            >
              {item}
            </Button>
          ),
        )}

        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => goTo(page + 1)}
          disabled={disabled || page >= totalPages}
          aria-label="Próxima página"
        >
          <ChevronRightIcon className="size-4" />
        </Button>
      </nav>

      <p className="text-xs text-muted-foreground" aria-live="polite">
        Página {page.toLocaleString('pt-BR')} de{' '}
        {totalPages.toLocaleString('pt-BR')}
      </p>
    </div>
  )
}
