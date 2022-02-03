/* this exists to build all assets with relative paths */

module.exports = {
  publicPath: '',
  configureWebpack: {
    output: {
      filename: '[name].js?[hash]'
    }
  }
}
