// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  rules: {
    'antfu/consistent-list-newline': 'off',
    'antfu/if-newline': 'off',
    'antfu/no-top-level-await': 'off',
    'markdownlint/MD041': 'off',
    'no-console': 'warn',
    'style/brace-style': ['error', '1tbs', { allowSingleLine: true }],
    'test/consistent-test-it': 'off',
  },
  typescript: true,
  unocss: true,
  react: true,
})
