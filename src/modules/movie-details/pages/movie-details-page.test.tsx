import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { HttpError } from '@/shared/api/http-error'

import { useMovieDetails } from '../hooks/use-movie-details'

import { MovieDetailsPage } from './movie-details-page'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children }: { children: ReactNode }) => <a>{children}</a>,
}))
vi.mock('../hooks/use-movie-details', () => ({ useMovieDetails: vi.fn() }))
vi.mock('../components/movie-details-view', () => ({
  MovieDetailsView: ({ movie }: { movie: { title: string } }) => (
    <div>{movie.title}</div>
  ),
}))

const mockedHook = vi.mocked(useMovieDetails)

function mockQuery(overrides: Partial<ReturnType<typeof useMovieDetails>>) {
  mockedHook.mockReturnValue({
    isLoading: false,
    isError: false,
    error: null,
    data: undefined,
    refetch: vi.fn(),
    ...overrides,
  } as ReturnType<typeof useMovieDetails>)
}

beforeEach(() => {
  mockedHook.mockReset()
})

describe('MovieDetailsPage', () => {
  it('mostra "não encontrado" quando o id não é um número', () => {
    mockQuery({})
    render(<MovieDetailsPage movieId="abc" />)
    expect(screen.getByText('Filme não encontrado')).toBeInTheDocument()
  })

  it('mostra "não encontrado" quando a API responde 404', () => {
    mockQuery({ isError: true, error: new HttpError(404, 'Not Found', null) })
    render(<MovieDetailsPage movieId="999" />)
    expect(screen.getByText('Filme não encontrado')).toBeInTheDocument()
  })

  it('mostra o skeleton enquanto carrega', () => {
    mockQuery({ isLoading: true })
    render(<MovieDetailsPage movieId="1" />)
    expect(screen.getByLabelText('Carregando filme')).toBeInTheDocument()
  })

  it('mostra erro com botão de retry num 500', () => {
    mockQuery({
      isError: true,
      error: new HttpError(500, 'Server Error', null),
    })
    render(<MovieDetailsPage movieId="1" />)
    expect(
      screen.getByText('Não foi possível carregar o filme'),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /tentar novamente/i }),
    ).toBeInTheDocument()
  })

  it('renderiza os detalhes quando há dados', () => {
    mockQuery({
      data: { title: 'Duna' } as ReturnType<typeof useMovieDetails>['data'],
    })
    render(<MovieDetailsPage movieId="1" />)
    expect(screen.getByText('Duna')).toBeInTheDocument()
  })
})
