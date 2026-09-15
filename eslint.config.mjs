import coreWebVitals from 'eslint-config-next/core-web-vitals'
import typescript from 'eslint-config-next/typescript'
import prettier from 'eslint-config-prettier'

export default [
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      '.velite/**',
      'public/**',
      'out/**',
      'AGENTS.md',
      'CLAUDE.md',
    ],
  },
  ...coreWebVitals,
  ...typescript,
  prettier,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'react/no-unescaped-entities': 'off',
      'react/prop-types': 'off',
    },
  },
]
