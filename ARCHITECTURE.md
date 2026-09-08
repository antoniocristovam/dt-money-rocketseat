# CineDash — Arquitetura

Cobre as 5 partes do desafio (fundação, auth simulada, dashboard de descoberta,
watchlist, detalhes do filme). Veja o Roadmap no fim.

## Visão geral da stack

| Camada             | Escolha                        | Por quê                                                                                  |
| ------------------ | ------------------------------ | ---------------------------------------------------------------------------------------- |
| Build/dev          | Vite + React 18/19 + TS strict | Padrão de mercado, HMR rápido, `tsc -b` no build garante type-safety em produção.        |
| Server state/cache | TanStack Query                 | Cache declarativo, dedupe, invalidação e `staleTime` — evita reinventar fetching.        |
| Client state       | Zustand (+ `persist`)          | API mínima, sem boilerplate de Context/Redux, `persist` cobre o requisito de refresh.    |
| Rotas              | TanStack Router (file-based)   | Type-safety de ponta a ponta em params/search, `beforeLoad` para guards, code-splitting. |
| UI                 | Tailwind v4 + shadcn/ui        | Tokens de tema via CSS vars (dark/light trivial), componentes copiados = sob controle.   |
| Formulários        | React Hook Form + Zod          | RHF minimiza re-renders; Zod compartilha schema entre form e validação de dados.         |
| Testes             | Vitest + Testing Library       | Mesmo pipeline do Vite, sem config duplicada; RTL para testar comportamento, não impl.   |
| Tabela             | TanStack Table (watchlist)     | Ordenação/colunas headless para a lista — sem herdar estilos de um datagrid pronto.      |

Nenhuma alternativa fora da stack obrigatória foi usada.

## Estrutura de pastas — modular + camadas Clean

```
src/
  app/        # composição: providers, router, rotas, estilos globais, bootstrap
  modules/    # áreas de rota (dashboard, watchlist, movie-details, login, not-found)
  widgets/    # blocos de UI reutilizáveis entre módulos (app-layout, watchlist-toggle-button)
  features/   # SÓ lógica transversal — model/ e hooks/, sem UI (auth, theme, watchlist, genres)
  services/   # 1 classe por domínio que fala com a API (movie/movie.service.ts)
  shared/     # infra agnóstica: http client, config, libs, UI kit
  _core/      # domínio puro, sem dependências: params, responses, dtos, mappers, helpers
```

- **`modules/<m>/`** — a UI de rota: `pages/` (a página), `components/` (componentes só
  daquele módulo, ex.: `login/components/login-form.tsx`), `hooks/` e `model/` (schemas,
  hooks de UI).
- **`widgets/<w>/`** — componentes de UI usados por **mais de um** módulo ou pela
  casca do app (`app-layout`, `watchlist-toggle-button`).
- **`features/<f>/`** — **nunca tem UI**. Só `model/` (stores Zustand, casos de uso)
  e `hooks/`. A UI que consome uma feature vive no módulo ou num widget.
- `index.ts` é a **public API** de cada slice.

### Camada de dados (baseada no padrão params / responses / service)

```
src/_core/models/
  params/movie/       get-movies-params.ts · get-movie-details-params.ts
  responses/movie/    get-genres-response.ts · get-movies-response.ts
                      get-movie-details-response.ts   (cada um traz os tipos de domínio que retorna)
  dtos/movie/         tmdb-movie.dto.ts        (formas cruas da API TMDB)
  mappers/movie/      movie.mappers.ts         (DTO → domínio)
  helpers/movie/      genre-names.ts
src/services/movie/
  movie.service.interface.ts   IMovieService — o contrato dos casos de uso
  movie.service.ts             class MovieService implements IMovieService + singleton `movieService`
```

- **Params/Responses** (`_core/models`) — um arquivo por tipo, barris `index.ts` em
  cada nível. O caller só lida com shapes de domínio, nunca com DTO `snake_case`.
- **Service** (`services/movie`) — cada método (`getMovies`, `getMovieDetails`,
  `getGenres`) recebe `params` tipado, faz a request via `httpClient` e mapeia
  DTO→domínio. Não engole erro: o `HttpError` propaga para o TanStack Query.
  Instância única exportada (`movieService`) — DI leve, sem provider.
- **Hooks** — `modules/<m>/hooks/use-*.tsx` (e `features/genres/hooks/use-genres.tsx`).
  Cada hook é um `useQuery` cuja `queryFn` é uma `request*` memoizada que chama
  `movieService.*`.

### Regra de dependência (imposta por lint)

`app → modules → widgets → features → services → shared → _core`

Uma camada só importa de camadas **abaixo** dela, e slices do mesmo nível **não**
se importam (ex.: uma feature não importa outra feature). `_core` é folha pura —
não importa nada. Verificado pelo `eslint-plugin-boundaries` em `eslint.config.js`;
violar quebra o `pnpm lint`. O alias `@/` é resolvido pelo resolver TypeScript na
regra, então mover arquivos não silencia a checagem.

### Rotas (`src/app/routes`)

Uma única pasta, com a árvore file-based do TanStack Router. O split
público/privado é feito com **pathless layout routes** (não adicionam segmento à
URL):

```
src/app/routes/
  __root.tsx              # shell (AppLayout) + devtools
  _public/                # rotas acessíveis sem sessão
    route.tsx             #   layout público
    login.tsx             #   /login
  _authenticated/         # rotas que exigem sessão
    route.tsx             #   layout privado + guard (beforeLoad)
    index.tsx             #   /  -> DashboardPage
  $.tsx                   # 404 (catch-all)
```

Os arquivos em `routes/` são finos: declaram a rota (path, `validateSearch`,
guard) e apontam para a página em `src/modules/*/pages/*`. A lógica de sessão
mora em `features/auth`; `_authenticated/route.tsx` só a consome no `beforeLoad`.
`_authenticated/movie.$movieId.tsx` cobre `/movie/:id`.

### Separação UI / Lógica / Dados

- **UI** (`components/`): recebe dados por props, dispara callbacks. Sem `fetch`, sem store.
- **Lógica** (`model/` + `hooks/`): hooks e stores — debounce, seleção de tema,
  filtros da URL, e os hooks de dados (`use-movies`, `use-movie-details`, `use-genres`).
- **Dados**: `shared/api/http-client.ts` (fetch tipado) → `services/movie` (casos
  de uso) → `_core/models` (params/responses/dtos/mappers). Ver a seção "Camada de
  dados" acima. As chaves de cache do TanStack Query ficam em `shared/api/query-keys.ts`.

## Autenticação sem backend (`features/auth`)

Como não há backend, a sessão é 100% client-side:

- **`model/login-schema.ts`** — schema Zod: e-mail válido + senha com mais de 6
  caracteres (`min(7)`). É a única fonte de verdade da validação.
- **`model/session-store.ts`** — store Zustand com middleware `persist`
  (`cinedash:session` no `localStorage`). No `signIn` gera um **token fictício**
  (`cinedash.<uuid>.<timestamp>`) e guarda `{ token, user }`; `signOut` limpa.
  Exporta também `getSession()` — acessor **não-reativo** para uso fora do React
  (nos guards de rota).
- **`model/use-login.ts`** — orquestra o formulário: RHF + `zodResolver`, simula
  latência de rede, chama `signIn`, dispara um toast e delega a navegação via
  callback `onSuccess` (a feature não conhece rotas).
- A UI vive no módulo: **`modules/login/components/login-form.tsx`** (Input/Label/Button do
  `shared/ui`), composta por `modules/login/pages/login-page.tsx`.

### Guard de rotas

O split público/privado usa os pathless layout routes já existentes:

| Rota                       | `beforeLoad`                                                        |
| -------------------------- | ------------------------------------------------------------------- |
| `_authenticated/route.tsx` | sem sessão → `redirect({ to: '/login', search: { redirect } })`     |
| `_public/route.tsx`        | com sessão → `redirect({ to: '/' })`                                |
| `_public/login.tsx`        | `validateSearch` (Zod) lê `?redirect=` e repassa à página como prop |

O guard lê `getSession()` diretamente (store como singleton) em vez do
`router context` — mais simples de testar e sem risco de contexto defasado. Após
login/logout a navegação é explícita, então não é preciso `router.invalidate()`.

O `logout` fica no `UserMenu` do `app-layout` (widget → feature): `signOut()` +
`navigate({ to: '/login' })`.

- Rotas protegidas (sob `_authenticated/`): dashboard, watchlist e detalhes do filme.
- Rotas públicas (sob `_public/`): login.

## Tema Dark/Light

`features/theme/model`:

- `theme-store.ts` — Zustand + `persist` (`cinedash:theme`), valores `light | dark | system`.
- `use-theme.ts` — combina a escolha persistida com a preferência do SO
  (`matchMedia`, reativo via `useSyncExternalStore`).
- `use-apply-theme.ts` — efeito único perto da raiz que aplica a classe `.dark`
  no `<html>`. Montado em `app/providers/app-providers.tsx`.

O dropdown fica em `widgets/app-layout/components/theme-toggle.tsx` (só o header usa).

## Dashboard de descoberta (`modules/dashboard`)

**Fonte de verdade = a URL.** O estado de busca/filtros/página vive nos search
params, validados por Zod em `_authenticated/index.tsx` (`dashboardSearchSchema`,
com `.catch()` em cada campo para URLs adulteradas não quebrarem). Benefícios:
compartilhável, back/forward funciona, sobrevive ao refresh, e a query key do
TanStack Query sai direto dos filtros.

Fluxo de dados:

```
URL search params ──(useDashboardFilters)──▶ DashboardPage
   │                                              │ toMoviesParams()
   │                                              ▼
   │                     useMovies(params) ──▶ movieService.getMovies(params)
   ▼                                                              │
useSearchInput (debounce 400ms no write) ◀── SearchInput          ▼
                                                    /discover/movie  ou  /search/movie
```

- **`movieService.getMovies`** decide entre `/discover/movie` (filtros nativos:
  `with_genres`, `primary_release_year`, `vote_average.gte`) e `/search/movie`
  (quando há texto; gênero/nota aplicados client-side, pois a busca do TMDB os
  ignora). `_core/models/mappers/movie` converte o DTO `snake_case` para o domínio
  e limita `totalPages` a 500 (teto do TMDB).
- **`modules/dashboard/hooks/use-movies.tsx`** — `useQuery` com
  `placeholderData: keepPreviousData` (paginação sem flash) e `staleTime` de 1 min.
- **`features/genres/hooks/use-genres.tsx`** — lista de gêneros
  (`staleTime: Infinity`) + `useGenres()` com `resolve(ids)`; é uma feature porque
  dashboard e watchlist consomem.
- **Debounce** — `shared/lib/use-debounced-value` (sobre o util `debounce`);
  `useSearchInput` faz o bind bidirecional input↔URL sem loop de eco (ref guarda
  o último valor propagado) e expõe `isDebouncing`.
- **Prefetch** — a página faz `queryClient.prefetchQuery` da próxima página
  sempre que há mais páginas.
- **Paginação** — `DashboardPagination` mostra páginas numeradas com reticências
  (`shared/lib/pagination-range`, testado) + "Página X de Y".
- **Feedback de carga** — spinner no `SearchInput` enquanto digita ou enquanto
  uma busca ativa está em voo; a grade fica em `opacity-60` durante o refetch de
  fundo (`keepPreviousData` mantém os resultados antigos); o select de gênero
  mostra spinner e fica `disabled` enquanto `useGenresQuery` carrega.
- **Estados** — `MovieGrid` cobre loading (skeletons), erro (com retry) e vazio.

## Watchlist (`features/watchlist` + `widgets/watchlist-toggle-button` + `modules/watchlist`)

- **`features/watchlist/model/watchlist-store.ts`** — Zustand + `persist`
  (`cinedash:watchlist`). Guarda um **snapshot enxuto** de cada filme
  (`toWatchlistMovie`) para a tabela funcionar offline. `toggle` devolve o
  estado resultante (para o toast). `add` deduplica por id.
- **`widgets/watchlist-toggle-button/`** — o botão de marcador. É um widget
  porque o dashboard (card, variante `icon` com `preventDefault` — o card é um
  `<Link>`) e os detalhes do filme consomem o mesmo componente.
- **`modules/watchlist`** — a `WatchlistPage` resolve os nomes de gênero
  (`useGenres`) e passa as linhas já prontas para `WatchlistTable`; a tabela
  não faz data-fetching. **TanStack Table** (`@tanstack/react-table` v8):
  `getSortedRowModel`, colunas ordenáveis por Título, Gênero e Lançamento
  (cabeçalho clicável). Remover linha e "Limpar lista" agem no store.
- Contador no header (`useWatchlistCount`) e link ativo via `<Link activeProps>`.

## Detalhes do filme (`modules/movie-details`)

- **`movieService.getMovieDetails({ id })`** — uma única chamada
  `/movie/{id}?append_to_response=credits,videos`; `mapMovieDetails` normaliza
  (deriva `genreIds` dos `genres`, corta o elenco em 12, e `pickTrailerKey`
  escolhe o melhor trailer do YouTube — oficial > qualquer Trailer > primeiro vídeo).
- **`modules/movie-details/hooks/use-movie-details.tsx`** — `useQuery` chaveado por
  `queryKeys.movies.detail(id)`, `enabled` só para id válido, **sem retry em 404**
  (id errado não adianta repetir).
- **`pages/movie-details-page.tsx`** — trata id inválido / 404 ("Filme não
  encontrado"), loading (skeleton) e erro (retry). O `MovieDetailsView` renderiza
  hero (backdrop + pôster + meta + sinopse + `WatchlistToggleButton`), trailer
  (iframe `youtube-nocookie`) e elenco. `MovieDetails` estende `MovieListItem`,
  então o botão de watchlist aceita direto.

### Notas da API do TMDB

- Auth por **Bearer token (v4)** no header, não `api_key` na query — no `httpClient`.
- Imagens são paths relativos; `posterUrl(path, size)` monta a URL do CDN.
- Gêneros vêm como IDs nos filmes; nome↔id vem de `/genre/movie/list` (cacheado).
- `total_pages` do TMDB pode passar de 500, mas só 500 são navegáveis.

## Roadmap

1. ✅ **Fundação** — tooling, estrutura modular, providers, layout, tema, testes base.
2. ✅ **Auth simulada** — login (RHF + Zod), token fictício persistido, guards de
   rota público/privado, logout.
3. ✅ **Dashboard de descoberta** — grid `/discover` + `/search`, busca com debounce,
   filtros (gênero, ano, nota) e paginação numerada na URL, skeletons/erro/vazio, prefetch.
4. ✅ **Watchlist** — add/remove/limpar, persistência (Zustand `persist`), tabela
   com `TanStack Table` (ordenar por título, gênero e lançamento).
5. ✅ **Detalhes do filme** — `/movie/$movieId`: sinopse, meta, elenco (top 12),
   trailer do YouTube, toggle na watchlist; trata 404 / id inválido.
