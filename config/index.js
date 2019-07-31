const path = require('path')
const distPath = path.resolve('dist')


module.exports = {
  build: {
    index: path.resolve(distPath, 'index.html'),
    publicPath: './',
    includeModules: true,
    productionSourceMap: false,
    productionGzip: false,
    productionGzipExtensions: ['js', 'css']
  },
  dev: {
    port: 8080,
    noInfo: true,
    publicPath: '/',
    proxyTable: require('./proxy.conf'),
    autoOpenBrowser: true,
    cssSourceMap: false
  },
  dlls: require('./dll.conf'),
  paths: {
    publicPath: '/',
    output: distPath,
    client: path.resolve('src'),
  },
  env: {
    development: require('./env/dev.env'),
    testing: require('./env/test.env'),
    production: require('./env/prod.env')
  }
}
