const path = require('path');

module.exports = {
    // mode: 'development',
    mode: 'production',

    entry: {
        'executor-editor': './src/index'
    },

    output: {
        library: 'ExecutorEditor',
        libraryTarget: 'umd',
        filename: '[name].js',
        path: path.join(__dirname, 'dist'),
        pathinfo: false
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            }
        ]
    }
};
