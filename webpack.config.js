'use strict';

var webpack = require('webpack');
var del = require('del');

// Remove last version of lib.
del([__dirname + '/dist/']);

module.exports = {
    entry: {
        'executor': './lib/index',
        'executor.min': './lib/index'
    },

    devtool: 'source-map',

    output: {
        library: 'Executor',
        libraryTarget: 'umd',

        filename: '[name].js',
        path: './dist',
        pathinfo: true
    },

    module: {
        noParse: [
            /ace-builds/
        ],
        loaders: [
            {
                test: /\.json$/,
                exclude: /executor\/node_modules/,
                loader: 'json-loader'
            },
            {
                test: /\.css$/,
                exclude: /executor\/node_modules/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.js$/,
                exclude: /executor\/node_modules/,
                loader: 'babel-loader',
                query: {
                    cacheDirectory: true,
                    presets: ['es2015', 'stage-0']
                }
            }
        ]
    },

    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            include: /\.min\.js$/,
            minimize: true
        })
    ]
};
