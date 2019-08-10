const path = require('path')
const webpack = require('webpack')
const HappyPack = require('happypack') // 提升构建速度
const WebpackBar = require('webpackbar');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const config = require('../../config')
const dllConfig = config.dlls.dllPlugin.defaults;

// 编译代码的基础配置
const clientWebpackConfig = {
  name: 'client',
  // 文件打包输出设置
  output: {
    path: config.paths.output,
    publicPath: config.paths.publicPath,
    filename: '[name].js'
  },
  // 调试工具,开发环境开启eval-source-map,生产构建时不开启
  devtool: (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'testing') ? false : '#eval-source-map',
  plugins: [
    // webpack编译过程中设置全局变量process.env
    new webpack.DefinePlugin({
      'process.env': config.env[process.env.NODE_ENV],
      'process.env.MOCK': !(process.env.MOCK === 'none'),
    }),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en|zh/), // 优化require,导入moment包时只加载en(英文)和zh(中文)的js
    // 用于提升构建速度
    new HappyPack({
      id: 'babel',
      threads: 2,
      loaders: [{
        loader: 'babel-loader'
      }]
    }),
  ],
  resolve: {
    // 设置模块导入规则，import/require时会直接在这些目录找文件
    modules: [path.resolve('common/components'), 'node_modules'],
    extensions: ['.js', '.jsx', '.react.js', '.css', '.json'], // import导入时省略后缀
    // import导入时别名
    alias: {
      '@swiper': path.resolve('node_modules/swiper/dist/js/swiper.js'), // 默认导入的swiper.es.bunder.js在uglify时报错
      '@': path.resolve(`src/`),
      '@inject': path.resolve(`src/redux/inject`),
      '@common': path.resolve('common'),
      '@history': path.resolve('common/utils/history'),
      '@dllAliasMap': path.resolve(`${dllConfig.buildPath}/dllAliasMap`),
      '@importDll': path.resolve('common/utils/importDll'),
      '@site': path.resolve('buildConfig'),
    }
  },
  module: {
    // 设置所以编译文件的loader
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'eslint-loader',
        include: config.paths.client,
        exclude: /node_modules/,
        enforce: 'pre',
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.(js|jsx)$/,
        use: ['happypack/loader?id=babel'],
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: 'images/[name].[ext]',
              limit: 2048,
              fallback: 'file-loader'
            }
          }
        ],
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: 'url-loader',
      },
      {
        test: /\.(mp3)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          name: 'audios/[name].[ext]',
          limit: 10,
          fallback: 'file-loader'
        }
      },
      {
        test: /\.html$/,
        use: 'html-loader'
      }
    ]
  },
  performance: {
    hints: false // 性能设置,文件打包过大时，不报错和警告，只做提示
  }
}

// progress
if (process.platform === 'win32') {
  clientWebpackConfig.plugins.push(new ProgressBarPlugin());
} else {
  clientWebpackConfig.plugins.push(new WebpackBar({
    color: 'green',
    reporters: ['fancy']
  }))
}


module.exports = clientWebpackConfig
