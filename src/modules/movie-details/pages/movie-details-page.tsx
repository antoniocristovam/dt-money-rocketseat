import { Link } from '@tanstack/react-router'
import { ArrowLeftIcon } from 'lucide-react'

import { Button } from '@/shared/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'

interface MovieDetailsPageProps {
  movieId: string
}

export const MovieDetailsPage = ({ movieId }: MovieDetailsPageProps) => {
  return (
    <section className="space-y-6">
      <Button asChild variant="ghost" size="sm">
        <Link to="/">
          <ArrowLeftIcon className="size-4" />
          Voltar
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Detalhes do filme #{movieId}</CardTitle>
          <CardDescription>
            Sinopse, elenco, trailer e o botão de watchlist chegam na próxima
            parte.
          </CardDescription>
        </CardHeader>
      </Card>
    </section>
  )
}
