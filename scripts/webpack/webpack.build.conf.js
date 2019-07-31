const path = require('path')
const webpack = require('webpack')
const glob = require('glob')
const merge = require('webpack-merge')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const baseWebpackConfig = require('./webpack.base.conf')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const config = require('../../config')
const utils = require('../tools/utils')
const dllConfig = config.dlls.dllPlugin.defaults;
const dllPath = path.resolve(dllConfig.buildPath);
const {
  postCssLoader,
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
const plugins = [
  new ManifestPlugin({
		fileName: 'asset-manifest.json',
	}),
  new MiniCssExtractPlugin({
		filename: 'stylesheet/[name].css?[chunkhash:8]',
    chunkFilename: 'stylesheet/[name].css?[chunkhash:8]',
    disable: false,
    allChunks: true,
	}),
  new HtmlWebpackPlugin({
    template: 'src/index.html',
    cache: false, // 防止各site项目一样时，不生成html文件
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeRedundantAttributes: true,
      useShortDoctype: true,
      removeEmptyAttributes: true,
      removeStyleLinkTypeAttributes: true,
      keepClosingSlash: true,
      minifyJS: true,
      minifyCSS: true,
      minifyURLs: true,
    },
    inject: true,
    favicon: 'favicon.ico'
  }),
];
const manifests = glob.sync(path.resolve(`${dllPath}/*Dll.json`));
manifests.forEach(item => {
  plugins.push(new webpack.DllReferencePlugin({
    context: process.cwd(),
    manifest: item,
  }))
})
glob.sync(`${dllConfig.buildPath}/reactDll*.dll.js`).forEach((dllPath) => {
  plugins.push(
    new AddAssetHtmlPlugin({
      filepath: dllPath,
      includeSourcemap: false,
      publicPath: './js',
      context: process.cwd(),
      outputPath: 'js',
      typeOfAsset: 'js'
    })
  );
});
glob.sync(`${dllConfig.buildPath}` + '/*.dll.css').forEach((dllPath) => {
  plugins.push(
    new AddAssetHtmlPlugin({
      filepath: dllPath,
      includeSourcemap: false,
      publicPath: './stylesheet',
      context: process.cwd(),
      outputPath: 'stylesheet',
      typeOfAsset: 'css'
    })
  );
});

function recursiveIssuer(m) {
	if (m.issuer) {
		return recursiveIssuer(m.issuer);
	} else if (m.name) {
		return m.name;
	} else {
		return false;
	}
}

const clientWebpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  entry: {
    index: './src/index.js'
  },
  output: {
    publicPath: config.build.publicPath,
    filename: 'js/[name].js?[chunkhash:8]',
    chunkFilename: 'js/[name].chunk.js?[chunkhash:8]'
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          parse: {
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            // turn off flags with small gains to speed up minification
            arrows: false,
            collapse_vars: false, // 0.3kb
            comparisons: false,
            computed_props: false,
            hoist_funs: false,
            hoist_props: false,
            hoist_vars: false,
            inline: false,
            loops: false,
            negate_iife: false,
            properties: false,
            reduce_funcs: false,
            reduce_vars: false,
            switches: false,
            toplevel: false,
            typeofs: false,

            // a few flags with noticable gains/speed ratio
            // numbers based on out of the box vendor bundle
            booleans: true, // 0.7kb
            if_return: true, // 0.4kb
            sequences: true, // 0.7kb
            unused: true, // 2.3kb

            // required features to drop conditional branches
            conditionals: true,
            dead_code: true,
            evaluate: true,
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
        },
        sourceMap: false,
        cache: true,
        parallel: true,
      })
    ],
    namedModules: true,
    namedChunks: true,
    runtimeChunk: false,
    noEmitOnErrors: true,
    splitChunks: {
      cacheGroups: {
        indexStyles: {
          name: 'index',
          test: (m, c, entry = 'index') =>
            m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
          chunks: 'all',
          enforce: true,
        },
        vendors: {  // 抽离自己写的公共代码
          chunks: "async",  // async针对异步加载的chunk做切割，initial针对初始chunk，all针对所有chunk。
          name: "vendors", // 打包后的文件名，任意命名
          minChunks: 2, // 最小引用2次
        },
      },
    }
  },
  module: {
    rules: [
      {
        test: cssRegex,
        exclude: cssModuleRegex,
        use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							// you can specify a publicPath here
							// by default it uses publicPath in webpackOptions.output
							publicPath: '../',
							hmr: process.env.NODE_ENV === 'development',
						},
					},
					cssLoader(false,true),
					postCssLoader,
				],
      },
      {
        test: cssModuleRegex,
        use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							// you can specify a publicPath here
							// by default it uses publicPath in webpackOptions.output
							publicPath: '../',
							hmr: process.env.NODE_ENV === 'development',
						},
					},
					cssLoader(true,true),
					postCssLoader,
				],
      },
      {
        test: sassRegex,
        exclude: [/node_module/, sassModuleRegex],
        use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							// you can specify a publicPath here
							// by default it uses publicPath in webpackOptions.output
							publicPath: '../',
							hmr: process.env.NODE_ENV === 'development',
						},
					},
					cssLoader(false,true),
          postCssLoader,
          sassLoader
				]
      },
      {
        test: sassModuleRegex,
        exclude: /node_module/,
        use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							// you can specify a publicPath here
							// by default it uses publicPath in webpackOptions.output
							publicPath: '../',
							hmr: process.env.NODE_ENV === 'development',
						},
					},
					cssLoader(true,true),
          postCssLoader,
          sassLoader
				]
      },
      {
        test: lessRegex,
        exclude: [/node_module/, lessModuleRegex],
        use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							// you can specify a publicPath here
							// by default it uses publicPath in webpackOptions.output
							publicPath: '../',
							hmr: process.env.NODE_ENV === 'development',
						},
					},
					cssLoader(false,true),
          postCssLoader,
          lessLoader
				]
      },
      {
        test: lessModuleRegex,
        exclude: /node_module/,
        use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							// you can specify a publicPath here
							// by default it uses publicPath in webpackOptions.output
							publicPath: '../',
							hmr: process.env.NODE_ENV === 'development',
						},
					},
					cssLoader(true,true),
          postCssLoader,
          lessLoader
				]
      }
    ]
  },
  plugins: plugins
})

if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

  clientWebpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (process.argv.slice(2)[0] == '--analyze') {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  clientWebpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = [clientWebpackConfig]

