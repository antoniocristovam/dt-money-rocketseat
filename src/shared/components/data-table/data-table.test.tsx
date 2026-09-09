import { type ColumnDef } from '@tanstack/react-table'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { DataTable } from './data-table'

interface Row {
  id: number
  name: string
  score: number
}

const rows: Row[] = [
  { id: 1, name: 'Beta', score: 2 },
  { id: 2, name: 'Alpha', score: 3 },
  { id: 3, name: 'Gamma', score: 1 },
]

const columns: ColumnDef<Row>[] = [
  { accessorKey: 'name', header: 'Nome', sortingFn: 'text' },
  { accessorKey: 'score', header: 'Nota', enableSorting: false },
]

function bodyColumn(index: number) {
  return screen
    .getAllByRole('row')
    .slice(1)
    .map((row) => within(row).getAllByRole('cell')[index]?.textContent)
}

describe('DataTable', () => {
  it('renderiza uma linha por item na ordem recebida', () => {
    render(<DataTable columns={columns} data={rows} />)

    expect(bodyColumn(0)).toEqual(['Beta', 'Alpha', 'Gamma'])
  })

  it('ordena (asc → desc) ao clicar num cabeçalho ordenável', async () => {
    const user = userEvent.setup()
    render(<DataTable columns={columns} data={rows} />)

    await user.click(screen.getByRole('button', { name: /nome/i }))
    expect(bodyColumn(0)).toEqual(['Alpha', 'Beta', 'Gamma'])

    await user.click(screen.getByRole('button', { name: /nome/i }))
    expect(bodyColumn(0)).toEqual(['Gamma', 'Beta', 'Alpha'])
  })

  it('não torna clicável um cabeçalho com sorting desativado', () => {
    render(<DataTable columns={columns} data={rows} />)

    expect(screen.queryByRole('button', { name: /nota/i })).toBeNull()
  })
})
