/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-prettier/skip-formatting',
    // 避免 eslint 阻擋
    'plugin:cypress/recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  }
}
