require('dotenv').config({silent: true});

const webpack = require('webpack');
const path = require('path');

const BUILD_DIR = path.resolve(__dirname, '../public/static');
const APP_DIR = path.resolve(__dirname, '../src');

const config = {
    entry: APP_DIR + '/index.js',
    output: {
        path: BUILD_DIR,
        filename: 'bundle.js'
    },
    module: {
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
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
        ]
    }
};

module.exports = config;