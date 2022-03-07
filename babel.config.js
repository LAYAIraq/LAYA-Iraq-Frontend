module.exports = {
  presets: [
    '@vue/app',
    '@babel/preset-env'
  ],
  plugins: [
    ...process.env.NODE_ENV === 'production' ? ['transform-remove-console'] : []
  ]
}
