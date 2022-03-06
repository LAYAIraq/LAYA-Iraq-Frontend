module.exports = {
  presets: [
    '@vue/app',
    ['@babel/preset-env', {targets: {node: 'current'}}]
  ],
  plugins: [
    ...process.env.NODE_ENV === 'production' ? ['transform-remove-console'] : []
  ]
}
