module.exports = {
  root: false,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    'plugin:vue/recommended',
    '@vue/standard',
    'standard',
    'eslint:recommended',
    '@vue/typescript'
  ],
  rules: {
    'dot-notation': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-return-assign': 'warn',
    'vue/html-self-closing': 'off'
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'latest'
  }
}
