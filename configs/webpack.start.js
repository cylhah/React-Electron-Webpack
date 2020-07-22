/*
 *  本地开发环境使用的配置
 */
const paramConfig = require('./webpack.params');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfigFn = require('./webpack.base');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


//loader
module.exports = function (env, argv) {
  const baseConfig = baseConfigFn(env, argv)
  const config = merge.smart(baseConfig, {
    devtool: 'eval-source-map',
    target: "electron-renderer",
    output: {
      path: path.resolve(__dirname, '../output'),
      filename: 'js/[name]_[hash:8].js',
      chunkFilename: 'js/[name]_[chunkhash:8].js',
      publicPath: paramConfig.localHost,
    },
    //设置本地开发环境
    devServer: {
      contentBase: path.join(__dirname, '../'),
      port: 3004,
      // host: '0.0.0.0',   // 开启局域网访问权限
      hotOnly: true,
      historyApiFallback: true,
      disableHostCheck: true
    }

  })

  //plugins
  config.plugins.push(
    // css提取打包
    new MiniCssExtractPlugin({
      filename: 'css/[name]_[hash:8].css',
      chunkFilename: 'css/[id]_[hash:8].css',
    }),
    new webpack.DefinePlugin({
      '_DEBUG': 'true'
    }),
    new webpack.SourceMapDevToolPlugin({
      exclude: /vendors_.+\.js/
    }),
    //热更新的两个插件
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  )
  return config
}
