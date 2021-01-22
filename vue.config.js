const webpack = require('webpack')

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/toonify/' : '/',
  chainWebpack: config => {
    config.module
      .rule('comlink')
      .test(/\.worker\.(js|ts)$/i)
      .use('comlink-loader')
      .loader('comlink-loader')
      .tap(options => {
        return Object.assign(options || {}, {singleton: true})
      })
  },

  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        'window.$': 'jquery',
        Popper: ['popper.js', 'default']
      })
    ]
  }
}