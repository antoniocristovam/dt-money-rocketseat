# CineDash — Instruções

## Projeto escolhido

**Opção A — CineDash**: dashboard de curadoria e descoberta de filmes consumindo a
[API do TMDB](https://developer.themoviedb.org/docs).

## Pré-requisitos

- **Node.js** >= 20
- **pnpm** >= 9 (`npm i -g pnpm`)
- Uma conta gratuita no [TMDB](https://www.themoviedb.org/signup) para gerar o token da API

## Configuração

1. Instale as dependências:

   ```bash
   pnpm install
   ```

2. Crie o arquivo `.env` a partir do exemplo:

   ```bash
   cp .env.example .env
   ```

3. Gere um **API Read Access Token (v4, Bearer)** em
   <https://www.themoviedb.org/settings/api> e preencha `VITE_TMDB_ACCESS_TOKEN`
   no `.env`. As demais variáveis já vêm com os valores padrão do TMDB.

   | Variável                   | Descrição                                   |
   | -------------------------- | ------------------------------------------- |
   | `VITE_TMDB_BASE_URL`       | Base da API REST do TMDB                    |
   | `VITE_TMDB_ACCESS_TOKEN`   | Token Bearer (v4) — **obrigatório**         |
   | `VITE_TMDB_IMAGE_BASE_URL` | Base do CDN de imagens (posters, backdrops) |

   > O ambiente é validado com Zod no boot (`src/shared/config/env.ts`). Se algo
   > estiver faltando, a aplicação falha rápido com uma mensagem clara.

## Scripts

| Comando              | O que faz                                              |
| -------------------- | ------------------------------------------------------ |
| `pnpm dev`           | Servidor de desenvolvimento (Vite) em `localhost:5173` |
| `pnpm build`         | Type-check (`tsc -b`) + build de produção              |
| `pnpm preview`       | Serve o build de produção                              |
| `pnpm test`          | Testes (Vitest) em modo run                            |
| `pnpm test:watch`    | Testes em modo watch                                   |
| `pnpm test:coverage` | Testes com relatório de cobertura                      |
| `pnpm lint`          | ESLint (inclui regras de fronteira do FSD)             |
| `pnpm typecheck`     | Type-check sem emitir                                  |
| `pnpm format`        | Formata com Prettier                                   |

## Rodando

```bash
pnpm dev
```

Acesse <http://localhost:5173>. As DevTools do TanStack Router e do TanStack Query
ficam disponíveis em desenvolvimento.

### Login (simulado)

Não há backend de autenticação. Na tela de login use **qualquer e-mail válido** e
**uma senha com mais de 6 caracteres** — ex.: `curador@cinedash.com` / `segredo7`.
A sessão é persistida no `localStorage` e sobrevive ao reload; use o menu do
usuário no header para sair.

## Estrutura e decisões

Veja [`ARCHITECTURE.md`](./ARCHITECTURE.md).
