const path = require('path')
const glob = require('glob') // match文件路径模块
const webpack = require('webpack')
const merge = require('webpack-merge')
const chalk = require('chalk')
const HtmlWebpackPlugin = require('html-webpack-plugin') // html模块插件
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin') // html模板中嵌入资源的插件，配合html-webpack-plugin插件一起使用
const baseWebpackConfig = require('./webpack.base.conf')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin') // 友好的错误提示，会显示具体的错误位置
const StyleLintPlugin = require('stylelint-webpack-plugin');
const config = require('../../config')
const utils = require('../tools/utils')
const dllConfig = config.dlls.dllPlugin.defaults;
const {
  postCssLoader,
  styleLoader,
  sassLoader,
  lessLoader,
  cssLoader,
} = utils.loadersConfig;

// style files regexes
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;
const lessRegex = /\.less$/;
const lessModuleRegex = /\.module\.less$/;

const plugin = [
  new StyleLintPlugin({
    files: ['src/**/*.s?(a|c)ss', 'src/**/*.less'],
    failOnError: false,
    quiet: true,
    syntax: 'scss',
    cache: true,
  }),
  new webpack.HotModuleReplacementPlugin(), // 热模块替换插件
  new webpack.NamedModulesPlugin(), // webpack的id本来是1,2,3...数字，将其替换成模块名路径，方便开发时调试
  new HtmlWebpackPlugin({
    filename: 'index.html',
    inject: true,
    template: 'src/index.html',
    favicon: 'favicon.ico'
  }),
  new FriendlyErrorsPlugin()
]
if (dllConfig) {
  glob.sync(`${dllConfig.devPath}/reactDll*.dll.js`).forEach((dllPath) => {
    plugin.push(
      new AddAssetHtmlPlugin({
        filepath: dllPath,
        includeSourcemap: false,
        typeOfAsset: 'js'
      })
    );
  });
}
function dependencyHandlers() {

  // 如果没有在config中没有dllConfig,就是用commonsChunkPlugin
  if (!dllConfig) {
    return [
      //公共模块提取插件
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        children: true,
        minChunks: 2,
        async: true,
      }),
    ];
  }

  const dllPath = path.resolve(dllConfig.devPath);

  /**
   *
   *
   */
  if (!dllConfig.dlls) {
    const plugins = [];
    const manifests = glob.sync(path.resolve(`${dllPath}/*Dll.json`))

    if (!manifests.length) {
      console.log(`${chalk.red('The DLL manifest is missing.')} Please run ${chalk.green('yarn dll')}`);
      process.exit(0);
    }
    manifests.forEach(item => {
      plugins.push(new webpack.DllReferencePlugin({
        context: process.cwd(),
        manifest: item,
      }))
    })
    //dll插件，配合DllPlugin使用
    return plugins;
  }
}

const clientWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  name: 'client',
  entry: {
    index: ['./scripts/tools/dev-client', './src/index.js']
  },
  output: {
    chunkFilename: 'js/[name].chunk.js'
  },
  module: {
    rules: [
      {
        test: cssRegex,
        exclude: cssModuleRegex,
        use: [styleLoader, cssLoader()]
      },
      {
        test: cssModuleRegex,
        use: [styleLoader, cssLoader(true)]
      },
      {
        test: sassRegex,
        exclude: [/node_module/, sassModuleRegex],
        use: [styleLoader, cssLoader(), postCssLoader, sassLoader]
      },
      {
        test: sassModuleRegex,
        exclude: /node_module/,
        use: [styleLoader, cssLoader(true), postCssLoader, sassLoader]
      },
      {
        test: lessRegex,
        exclude: [/node_module/, lessModuleRegex],
        use: [styleLoader, cssLoader(), postCssLoader, lessLoader]
      },
      {
        test: lessModuleRegex,
        exclude: /node_module/,
        use: [styleLoader, cssLoader(true), postCssLoader, lessLoader]
      }
    ]
  },
  resolve: {
    alias: {
      //设置路径别名
    }
  },
  plugins: dependencyHandlers().concat(plugin)
})

module.exports = [clientWebpackConfig]
