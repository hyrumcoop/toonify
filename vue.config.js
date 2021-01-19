
module.exports = {
  chainWebpack: config => {
    config.module
      .rule('comlink')
      .test(/\.worker\.(js|ts)$/i)
      .use('comlink-loader')
      .loader('comlink-loader')
      .tap(options => {
        return Object.assign(options || {}, {singleton: true})
      })
  }
}