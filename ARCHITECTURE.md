# CineDash — Arquitetura

Documento vivo. Cobre até a **parte 2** (fundação + autenticação simulada); as
próximas features seguem as mesmas regras. Veja o Roadmap no fim.

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

## Estrutura de pastas — Feature-Sliced Design + camadas Clean

```
src/
  app/        # composição da aplicação: providers, router, estilos globais, bootstrap
  pages/      # uma pasta por rota — apenas orquestra widgets/features
  widgets/    # blocos de UI compostos e reutilizáveis entre páginas (ex.: app-layout)
  features/   # unidades de negócio com estado/efeito (ex.: theme; depois: auth, discovery…)
  entities/   # modelos de domínio compartilhados (ex.: movie, genre) — tipos e mappers
  shared/     # base agnóstica de domínio: api client, config, libs, componentes de UI
```

Dentro de cada slice de `features/*` e `widgets/*` as **camadas Clean** (páginas
são finas o suficiente para ficarem num arquivo só):

| Pasta      | Responsabilidade                                          | Pode depender de        |
| ---------- | --------------------------------------------------------- | ----------------------- |
| `model/`   | regra de negócio: stores, hooks, casos de uso             | `shared`, `entities`    |
| `api/`     | acesso a dados: serviços que falam com o `httpClient`     | `shared`, `entities`    |
| `ui/`      | apresentação: componentes React "burros"                  | `model`, `ui`, `shared` |
| `index.ts` | **public API** do slice — o único ponto de import externo | —                       |

### Regra de dependência (imposta por lint)

`app → pages → widgets → features → entities → shared`

Uma camada só importa de camadas **abaixo** dela, e slices do mesmo nível **não**
se importam (ex.: uma feature não importa outra feature). Isso é verificado pelo
`eslint-plugin-boundaries` em `eslint.config.js` — violar a regra quebra o
`pnpm lint`. O import via alias `@/` também é resolvido pelo TypeScript resolver
na regra, então mover arquivos não silencia a checagem.

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

Os arquivos em `routes/` são finos: só declaram a rota e apontam para a página
correspondente em `src/pages/*`. A lógica de sessão mora em `features/auth`; a
rota `_authenticated/route.tsx` apenas a consome no `beforeLoad` (ver abaixo).

### Separação UI / Lógica / Dados

- **UI** (`ui/`): recebe dados por props, dispara callbacks. Sem `fetch`, sem store.
- **Lógica** (`model/`): hooks e stores. É onde vivem debounce, seleção de tema,
  regras de watchlist etc.
- **Dados** (`api/` + `shared/api`): todo acesso HTTP passa por
  `shared/api/http-client.ts` (injeta auth do TMDB, monta query string, normaliza
  erro em `HttpError`). As chaves de cache do TanStack Query ficam centralizadas
  em `shared/api/query-keys.ts`.

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
- **`ui/login-form.tsx`** — apresentação pura (Input/Label/Button do `shared/ui`).

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

`features/theme`:

- `theme-store.ts` — Zustand + `persist` (`cinedash:theme`), valores `light | dark | system`.
- `use-theme.ts` — combina a escolha persistida com a preferência do SO
  (`matchMedia`, reativo via `useSyncExternalStore`).
- `use-apply-theme.ts` — efeito único perto da raiz que aplica a classe `.dark`
  no `<html>`. Montado em `app/providers/app-providers.tsx`.
- `ui/theme-toggle.tsx` — dropdown (shadcn) no header.

## Desafios com a API do TMDB (a detalhar nas próximas partes)

- Autenticação por **Bearer token (v4)** no header `Authorization`, não por
  `api_key` na query — encapsulado no `httpClient` para não repetir.
- Imagens vêm em paths relativos (`/abc.jpg`); a URL completa depende de um
  `size` do CDN (`VITE_TMDB_IMAGE_BASE_URL` + size + path).
- Gêneros são retornados como IDs nos filmes; a lista nome↔id vem de um endpoint
  separado (`/genre/movie/list`) e será cacheada com `staleTime` longo.
- Paginação do TMDB é limitada a 500 páginas e o `total_results` nem sempre bate
  com `page * 20` — a UI de paginação precisa tratar isso.

## Roadmap

1. ✅ **Fundação** — tooling, estrutura FSD, providers, layout, tema, testes base.
2. ✅ **Auth simulada** — login (RHF + Zod), token fictício persistido, guards de
   rota público/privado, logout.
3. **Dashboard de descoberta** — listagem (trending/popular), busca com debounce,
   filtros (gênero, ano, nota), paginação/infinite scroll, skeletons e error states.
4. **Watchlist** — add/remove, persistência (Zustand `persist`), tabela com
   `TanStack Table` (ordenar por título, gênero, rating).
5. **Detalhes do filme** — rota `/movie/$id`, sinopse, elenco, trailer, toggle na lista.
