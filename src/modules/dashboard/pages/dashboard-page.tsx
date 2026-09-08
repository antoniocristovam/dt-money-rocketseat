import { Card, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'

export const DashboardPage = () => {
  return (
    <section className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Descoberta</h1>
        <p className="text-muted-foreground">
          Curadoria e descoberta de filmes com dados do TMDB.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Em construção</CardTitle>
          <CardDescription>
            A listagem de filmes, filtros e paginação chegam na próxima parte.
          </CardDescription>
        </CardHeader>
      </Card>
    </section>
  )
}
