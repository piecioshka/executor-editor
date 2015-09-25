module.exports = {
    resolve: {
        extensions: ['.es6.js', '.js', '']
    },
    entry: './app/scripts/main',
    output: {
        filename: 'terminal.js',
        path: './app/dist'
    },
    module: {
        preLoaders: [
            {
                test: /\.es6\.js/,
                exclude: /node_modules/,
                loader: 'eslint-loader'
            }
        ],
        loaders: [
            {
                test: /\.es6\.js/,
                exclude: /node_modules/,
                loader: 'babel-loader?stage=0'
            }
        ]
    }
};
