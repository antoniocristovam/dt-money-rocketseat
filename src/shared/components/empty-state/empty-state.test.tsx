import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { EmptyState } from './empty-state'

describe('EmptyState', () => {
  it('mostra o título e, quando passada, a descrição', () => {
    render(<EmptyState title="Nada por aqui" description="Tente outro filtro" />)

    expect(screen.getByText('Nada por aqui')).toBeInTheDocument()
    expect(screen.getByText('Tente outro filtro')).toBeInTheDocument()
  })

  it('omite ícone, descrição e ação quando não são passados', () => {
    const { container } = render(<EmptyState title="Só o título" />)

    expect(container.querySelector('svg')).toBeNull()
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('renderiza a ação recebida', () => {
    render(
      <EmptyState title="Erro" action={<button>Tentar novamente</button>} />,
    )

    expect(
      screen.getByRole('button', { name: 'Tentar novamente' }),
    ).toBeInTheDocument()
  })

  it('aplica a borda tracejada por padrão e a remove com bordered={false}', () => {
    const { rerender, container } = render(<EmptyState title="x" />)
    expect(container.firstChild).toHaveClass('border-dashed')

    rerender(<EmptyState title="x" bordered={false} />)
    expect(container.firstChild).not.toHaveClass('border-dashed')
  })
})
