require('dotenv').config({silent: true});

const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const BUILD_DIR = path.resolve(__dirname, '../public');
const APP_DIR = path.resolve(__dirname, '../src');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');

const extractSass = new ExtractTextPlugin({
    filename: "[name].css",
    //disable: process.env.NODE_ENV === "development"
});

const config = {
    entry: {
        app: APP_DIR + '/index.js',
        print: APP_DIR + '/print.js',
    },
    plugins: [
        new CleanWebpackPlugin(BUILD_DIR),
        new CopyWebpackPlugin([
                {
                    context: 'assets',
                    from: '**/*',
                    to: '[path][name].[ext]'
                }
            ]
        ),
        new HtmlWebpackPlugin({
            template: path.resolve('src/index.html'),
            filename: path.resolve('public/index.html'),
            hash: true,
            minify: {
                collapseWhitespace: true
            }
        }),
        new HtmlWebpackIncludeAssetsPlugin({assets: [], append: true}),
        new ScriptExtHtmlWebpackPlugin(
            {
                defaultAttribute: 'async'
            }
        ),
        /*
         new FaviconsWebpackPlugin(
         {
         logo: APP_DIR + '/logo-small.png',
         prefix: 'icons-[hash:8]/',
         icons: {
         android: true,
         appleIcon: true,
         appleStartup: true,
         coast: true,
         favicons: true,
         firefox: true,
         yandex: true,
         windows: true,
         twitter: true,
         opengraph: true
         }
         }
         ),*/
        extractSass,
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.CommonsChunkPlugin(
            {
                name: "common",
                filename: "commons.js",
            }
        ),
        new webpack.optimize.CommonsChunkPlugin(
            {
                name: "manifest",
                minChunks: Infinity
            }
        )
    ],
    output: {
        path: BUILD_DIR,
        filename: '[name].bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: extractSass.extract({
                    use: [
                        {
                            loader: "css-loader"
                        },
                        {
                            loader: "sass-loader"
                        }
                    ],
                    // use style-loader in development
                    fallback: "style-loader"
                })
            },
            {
                test: /\.js?$/,
                use: "babel-loader",
            },
            {
                test: /\.(png|svg|jpg|gif|woff|woff2|eot|ttf|otf)$/,
                use: 'file-loader'
            }
        ],
        loaders: [
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                loaders: "babel-loader",
                query: {
                    cacheDirectory: true,
                    presets: ['react', 'es2015'],
                },
            },
            {
                test: /\.(png|svg|jpg|gif|woff|woff2|eot|ttf|otf)$/,
                loader: 'file-loader'
            }
        ]
    }
};

module.exports = config;