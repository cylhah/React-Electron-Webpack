/*
 *  正式环境使用的配置
 */
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfigFn = require('./webpack.base');
const CopyWebpackPlugin = require('copy-webpack-plugin');

//webpack 4.x 版本运行时，mode 为 production 即会启动压缩 JS 代码的插件

module.exports = function (env, argv) {
  const baseConfig = baseConfigFn(env, argv)
  const MiniCssExtractPlugin = require("mini-css-extract-plugin");
  const config = merge.smart(baseConfig, {
    output: {
      path: path.resolve(__dirname, '../build'),
      filename: 'js/[name]_[chunkhash:8].js',
      chunkFilename: 'js/[name]_[chunkhash:8].js',
      publicPath: './'
    },
    target: "electron-renderer",
    plugins: [
      new webpack.HashedModuleIdsPlugin(),
      new MiniCssExtractPlugin({
        filename: "css/[name]_[contenthash:8].css",
        publicPath: "css"
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: path.resolve(__dirname, '../main.js'), to: '../build/main.js' }
        ]
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: path.resolve(__dirname, '../icon.ico'), to: '../build/icon.ico' }
        ]
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, '../package.json'),       // 打包electron package.json
            to: path.resolve(__dirname, '../build/package.json')
          }
        ]
      }),
    ],
  })
  return config
}
