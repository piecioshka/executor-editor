module.exports = {
    resolve: {
        extensions: ['.css', '.es6.js', '.js', '']
    },
    entry: './app/scripts/main',
    output: {
        filename: 'executor.js',
        path: './app/dist'
    },
    module: {
        noParse: [
            /ace-builds/
        ],
        preLoaders: [
            {
                test: /\.es6\.js/,
                exclude: /node_modules/,
                loader: 'eslint-loader'
            }
        ],
        loaders: [
            {
                test: /\.css/,
                exclude: /node_modules/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.es6\.js/,
                exclude: /node_modules/,
                loader: 'babel-loader?stage=0'
            }
        ]
    }
};
