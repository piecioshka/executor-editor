const webpack = require('webpack');
const DashboardPlugin = require('webpack-dashboard/plugin');

module.exports = {
    entry: {
        'executor-editor': './lib/index',
        'executor-editor.min': './lib/index'
    },

    output: {
        library: 'ExecutorEditor',
        libraryTarget: 'umd',
        filename: '[name].js',
        path: './dist',
        pathinfo: false
    },

    module: {
        noParse: [
            /ace-builds/
        ],
        loaders: [
            {
                test: /\.json$/,
                exclude: /executor-editor\/node_modules/,
                loader: 'json-loader'
            },
            {
                test: /\.css$/,
                exclude: /executor-editor\/node_modules/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.js$/,
                exclude: /executor-editor\/node_modules/,
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
        }),
        new DashboardPlugin()
    ]
};
