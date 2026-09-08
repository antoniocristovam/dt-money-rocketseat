import js from '@eslint/js'
import pluginQuery from '@tanstack/eslint-plugin-query'
import { defineConfig, globalIgnores } from 'eslint/config'
import eslintConfigPrettier from 'eslint-config-prettier'
import boundaries from 'eslint-plugin-boundaries'
import importX from 'eslint-plugin-import-x'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'

/**
 * Feature-Sliced Design layers, from most to least app-specific. A layer may
 * only import from layers below it, and slices on the same layer may not import
 * each other. Enforced by `boundaries/dependencies`.
 */
const LAYERS = ['app', 'pages', 'widgets', 'features', 'entities', 'shared']

const fsdPolicies = LAYERS.map((layer, index) => ({
  from: { element: { type: layer } },
  allow: { to: { element: { types: { anyOf: LAYERS.slice(index + 1) } } } },
})).filter((policy) => policy.allow.to.element.types.anyOf.length > 0)

// The `app` and `shared` layers are single conceptual slices: their own files
// may import each other freely.
fsdPolicies.push(
  {
    from: { element: { type: 'app' } },
    allow: { to: { element: { type: 'app' } } },
  },
  {
    from: { element: { type: 'shared' } },
    allow: { to: { element: { type: 'shared' } } },
  },
)

export default defineConfig([
  globalIgnores(['dist', 'coverage', 'src/app/routes/routeTree.gen.ts']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      pluginQuery.configs['flat/recommended'],
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: { boundaries, 'import-x': importX },
    settings: {
      'boundaries/elements': [
        { type: 'app', pattern: 'src/app/*' },
        { type: 'pages', pattern: 'src/pages/*' },
        { type: 'widgets', pattern: 'src/widgets/*' },
        { type: 'features', pattern: 'src/features/*' },
        { type: 'entities', pattern: 'src/entities/*' },
        { type: 'shared', pattern: 'src/shared/*' },
      ],
      // `import-x/resolver` is read by import-x; `import/resolver` by boundaries.
      'import-x/resolver': {
        typescript: {
          alwaysTryTypes: true,
          noWarnOnMultipleProjects: true,
          project: ['tsconfig.app.json', 'tsconfig.node.json'],
        },
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          noWarnOnMultipleProjects: true,
          project: ['tsconfig.app.json', 'tsconfig.node.json'],
        },
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: { attributes: false } },
      ],
      'import-x/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          pathGroups: [{ pattern: '@/**', group: 'internal' }],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'boundaries/dependencies': [
        'error',
        { default: 'disallow', policies: fsdPolicies },
      ],
    },
  },
  {
    // shadcn/ui primitives export variant helpers; route files export `Route`.
    files: ['src/shared/ui/**/*', 'src/app/routes/**/*'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },
  {
    files: ['**/*.test.{ts,tsx}', 'src/test/**/*', 'src/main.tsx'],
    rules: { 'boundaries/dependencies': 'off' },
  },
  {
    files: ['*.{ts,js}'],
    languageOptions: { globals: globals.node },
    rules: { 'boundaries/dependencies': 'off' },
  },
  eslintConfigPrettier,
])
