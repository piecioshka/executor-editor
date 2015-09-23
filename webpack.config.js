module.exports = {
    resolve: {
        extensions: ['.es6.js', '.js', '']
    },
    entry: './scripts/main.es6.js',
    output: {
        filename: 'terminal.js',
        path: 'dist'
    },
    module: {
        loaders: [
            {
                test: /\.es6\.js/,
                exclude: /node_modules/,
                loader: 'babel'
            }
        ]
    }
};
