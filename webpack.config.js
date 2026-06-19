const path = require('path');

module.exports = {
    // mode: 'development',
    mode: 'production',

    entry: {
        'executor-editor': './src/index.ts'
    },

    output: {
        library: 'ExecutorEditor',
        libraryTarget: 'umd',
        libraryExport: 'default',
        filename: '[name].js',
        path: path.join(__dirname, 'dist'),
        pathinfo: false
    },

    resolve: {
        extensions: ['.ts', '.js', '.json']
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: 'ts-loader'
            }
        ]
    }
};
