/*
 *  基础配置，即多个文件中共享的配置
 */

const path = require('path');
const os = require("os");
const webpack = require('webpack');
const HappyPack = require("happypack");
//引入 happy pack 多线程机制，提高打包速度
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
//html 打包
const HtmlWebpackPlugin = require('html-webpack-plugin');
//执行一些文件目录的清理工作
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const resolve = dir => path.resolve(__dirname, dir);

module.exports = function (env, argv) {
    const CHANNEL = process.env.CHANNEL || 'dist'
    const entry = {
        index: ['./src/index.js']
    }

    let config =
    {
        //入口
        entry: entry,
        //loader配置
        module: {
            noParse: [/jszip.js$/],
            rules: [
                // js
                {
                    test: /\.(js|jsx)$/,
                    exclude: [
                        /node_modules\/(?!(autobind-decorator)\/).*/
                    ],
                    include: [
                        resolve('../src')
                    ],
                    use: ['happypack/loader?id=babel']
                },
                // scss
                {
                    test: /\.scss$/,
                    use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
                },
                // image
                {
                    test: /\.(png|jpg|jpeg|gif|svg)$/,
                    use: [{
                        loader: 'file-loader',
                        options: {
                            outputPath: 'img',
                            name: '[name]_[hash:8].[ext]'
                        }
                    }]
                },
                // media
                {
                    test: /\.(mp3|ogg|m4a|mp4|webm)$/,
                    use: [{
                        loader: 'file-loader',
                        options: {
                            outputPath: 'res',
                            name: '[name]_[hash:8].[ext]'
                        }
                    }]
                },
                // font
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/,
                    use: [{
                        loader: 'file-loader',
                        options: {
                            outputPath: 'font',
                            name: '[name]_[hash:8].[ext]'
                        }
                    }]
                },
                {
                    test: /\.(glsl|vs|fs|vert|frag)$/,
                    use: [
                        'raw-loader',
                        'glslify-loader'
                    ]
                },
            ]
        },
        externals: {
            window: 'window',
            'jquery': 'window.jQuery'
        },
        //代码模块路径解析的配置
        resolve: {
            alias: {
                '@': resolve('../src')
            },
            extensions: ['*', '.js', '.jsx', '.json']
        },
        resolveLoader: {
            extensions: ['.js', '.json']
        },
        optimization: {
            splitChunks: {
                cacheGroups: {
                    vendors: {
                        test: /[\\/]node_modules[\\/]/,
                        minChunks: 1,
                        enforce: true,
                        name: 'vendors'
                    }
                }
            },
            minimizer: [
                new UglifyJSPlugin({
                    cache: true,
                    parallel: true,
                    sourceMap: true // set to true if you want JS source maps
                }),
                new OptimizeCSSAssetsPlugin({})
            ]
        },
        plugins: [
            //打包之前执行目录的清理工作
            new CleanWebpackPlugin(["build/*", "release/*"], {
                "root": resolve('../'),
                verbose: true,
                dry: false
            }),
            //多进程处理babel转js
            new HappyPack({
                id: 'babel',
                threadPool: happyThreadPool,
                loaders: [
                    'babel-loader'
                ]
            }),
            new webpack.DefinePlugin({
                'process': 'window.process',
                '__DEBUG': CHANNEL === 'release' ? JSON.stringify(false) : JSON.stringify(true)
            })
        ],
    };
    let tplConfigs = [
        //生成入口页
        {
            pathname: 'index',
            filename: 'index.html',
            template: resolve('../src/index.html'),
            chunksSortMode: 'manual',
            chunks: ['vendors', 'index'],
            // minify: true,
        },
        {
            pathname: 'print',
            filename: 'print.html',
            template: path.resolve(__dirname, '../src/print.html'),
            chunksSortMode: 'manual',
            chunks: ['print'],
        }
    ]

    tplConfigs.forEach((conf) => {
        //开发环境，将html加到入口中，实现自动刷新页面
        if (process.env.NODE_ENV === 'development') {
            config.entry["_refresh_html_" + conf.pathname] = tplPages[conf.pathname];
        }

        config.plugins.push(new HtmlWebpackPlugin(conf));
    });
    return config

}
