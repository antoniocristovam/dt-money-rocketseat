import { Link } from '@tanstack/react-router'

import { EmptyState } from '@/shared/components/empty-state'
import { Button } from '@/shared/ui/button'

export const NotFoundPage = () => {
  return (
    <EmptyState
      bordered={false}
      className="py-24"
      icon={
        <span className="text-5xl font-bold tracking-tight text-muted-foreground">
          404
        </span>
      }
      title="Página não encontrada"
      description="O endereço acessado não existe ou foi movido."
      action={
        <Button asChild>
          <Link to="/">Voltar para o início</Link>
        </Button>
      }
    />
  )
}
