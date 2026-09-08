import { NotFound } from '@/shared/components/notFoundPage'

export const NotFoundPage = () => {
  return (
    <NotFound
      title="Página não encontrada"
      buttonText="Voltar para o início"
      description="O endereço acessado não existe ou foi movido."
    />
  )
}
