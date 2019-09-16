/**
 * 打包Dll的Webpack配置文件
 *
 */
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const config = require('../../config');
const generateDllMap = require('../tools/generateDllMap')

const dlls = config.dlls;
const dllVersion = dlls.version;
const dllConfig = dlls.dllPlugin.defaults;
const dllEntry = dlls.dllPlugin.entry;
const outputPath = path.resolve(dllConfig.buildPath);
const outputPathMap = path.resolve(dllConfig.buildPath, '[name].json');
const isDev = process.env.NODE_ENV === 'development';

const plugins = [
  // dll插件
  new webpack.DllPlugin({
    name: '[name]', // json文件名
    path: outputPathMap // 生成映射表json文件地址
  }),
  // 删除文件
  new CleanWebpackPlugin([outputPath], {
    root: process.cwd(), // 根目录
    verbose: true, // 开启在控制台输出信息
    dry: false // 启用删除文件
  }),
]

if (isDev) {
  // 将webpack生成的映射表中的数字id，替换为路径id  1---->./nodu_module/react/dist/react.js
  plugins.push(new webpack.NamedModulesPlugin());
}

module.exports = merge(baseWebpackConfig, {
  context: process.cwd(), // 上下文
  entry: dllEntry(), // 文件入口
  mode: isDev ? 'development' : 'production',
  // 打包文件输出
  output: {
    filename: `[name]_${dllVersion}.dll.js`,
    path: outputPath,
    library: '[name]',
  },
  // loaders
  plugins: plugins, // webpack插件
  // 性能提示
  performance: {
    hints: false,
  },
})

// 打包完，生成dllAliasMap.json
process.on('exit', (err) => {
  generateDllMap(outputPath, err);
});
