# CineDash — Arquitetura

Resumo das decisões técnicas. As 5 partes do desafio estão implementadas
(auth simulada, dashboard, watchlist, detalhes do filme, tema).

## Stack — por que cada peça

| Camada             | Escolha                     | Por quê                                                                       |
| ------------------ | --------------------------- | ---------------------------------------------------------------------------- |
| Build              | Vite + React 19 + TS strict | `tsc -b` no build garante type-safety em produção.                          |
| Server state       | TanStack Query              | Cache, dedupe, invalidação e `staleTime` prontos — sem reinventar fetching. |
| Client state       | Zustand + `persist`         | API mínima; `persist` cobre "sobreviver ao refresh" sem código extra.       |
| Rotas              | TanStack Router             | Type-safety em params/search e `beforeLoad` para guards, sem wrapper.       |
| UI                 | Tailwind v4 + shadcn/ui     | Tema dark/light por CSS vars; componentes copiados = sob nosso controle.    |
| Formulários        | React Hook Form + Zod       | Poucos re-renders; o schema Zod é a única fonte de verdade da validação.    |
| Tabela             | TanStack Table              | Ordenação headless na watchlist (o "diferencial" do desafio).               |
| HTTP               | axios                       | Instância única com baseURL + token; interceptor normaliza o erro.          |
| Testes             | Vitest + Testing Library    | Mesmo pipeline do Vite; 80 testes cobrindo regras de negócio e fluxos.      |

Nenhuma alternativa fora da stack obrigatória.

## Estrutura de pastas — modular + camadas Clean

```
src/
  app/       composição: providers, router, rotas, bootstrap
  modules/   áreas de rota: dashboard, watchlist, movie-details, login, not-found
  widgets/   UI reutilizada entre módulos (app-layout, watchlist-toggle-button)
  features/  lógica transversal — SÓ model/ e hooks/, sem UI (auth, theme, watchlist, genres)
  services/  1 classe por domínio que fala com a API (movie.service.ts)
  shared/    infra: cliente axios, config, libs, ui/ (shadcn) e components/ genéricos
  _core/     domínio puro: params, responses, dtos, mappers (sem dependências)
```

**Regra de dependência** (imposta pelo `eslint-plugin-boundaries` — violar quebra
o `pnpm lint`): `app → modules → widgets → features → services → shared → _core`.
Cada camada só importa das de baixo; slices do mesmo nível não se importam.

**Separação UI / Lógica / Dados:** componentes recebem props e disparam callbacks
(sem `fetch`, sem store); a lógica vive em `model/` + `hooks/`; os dados fluem
`shared/api` (axios) → `services` (casos de uso) → `_core` (DTO → domínio).

## Autenticação sem backend (`features/auth`)

Sessão 100% client-side:

- **Validação:** schema Zod (`login-schema.ts`) — e-mail válido + senha `min(7)`.
- **Sessão:** store Zustand com `persist` (`cinedash:session`). O `signIn` gera um
  token fictício e persiste `{ token, user }`; sobrevive ao reload.
- **Guards:** rotas em pathless layouts `_authenticated` / `_public`; o `beforeLoad`
  lê `getSession()` (acessor não-reativo do store) e redireciona. Sem sessão →
  `/login?redirect=…`; já logado tentando `/login` → `/`.
- A feature não conhece rotas — a navegação pós-login/logout é feita por callback.

## Como resolvi os pontos centrais

- **Estado do dashboard = a URL.** Busca, filtros e página vivem nos search params,
  validados por Zod com `.catch()` em cada campo (URL adulterada cai no default).
  Ganho: link compartilhável, back/forward e refresh funcionam, e a query key do
  TanStack Query sai direto dos filtros.
- **Erro → toast, num lugar só.** `QueryCache.onError` no `createQueryClient` mostra
  um toast com a mensagem do servidor; 404 e telas com estado próprio (`meta.skipErrorToast`)
  ficam de fora. O resto do código só chama `notify.*`.
- **Debounce sem loop de eco.** `useSearchInput` faz o bind input↔URL com 400 ms de
  debounce; uma `ref` guarda o último valor propagado para não reescrever o que veio da URL.
- **Cache por recurso:** `staleTime` 60 s (listas), 5 min (detalhes), `Infinity` (gêneros);
  `keepPreviousData` na paginação; `prefetchQuery` da próxima página; sem retry em 404.
- **Reuso de UI:** o que se repete entre módulos sobe para `shared/components/`
  (`DataTable` sobre o TanStack Table, `EmptyState`, `RatingBadge`, `TmdbImage`).

## Desafios da API do TMDB

- **Auth v4:** Bearer token no header (não `api_key` na query) — configurado uma vez
  na instância axios.
- **Busca ignora filtros:** `/search/movie` não aceita gênero/nota, então quando há
  texto o service usa `/search` e aplica esses filtros client-side; sem texto usa
  `/discover` com os filtros nativos.
- **Teto de paginação:** `total_pages` pode passar de 500, mas só 500 são navegáveis —
  o mapper limita.
- **Gêneros como IDs:** os filmes trazem só `genre_ids`; o nome vem de `/genre/movie/list`
  (cacheado com `staleTime: Infinity`).
- **Imagens:** paths relativos — `posterUrl(path, size)` monta a URL do CDN.
