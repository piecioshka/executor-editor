module.exports = {
    extends: 'piecioshka',
    parser: 'babel-eslint',

    // http://eslint.org/docs/user-guide/configuring#specifying-environments
    env: {
        es6: true,
        browser: true,
        node: true,
        commonjs: true,
        amd: true,
        // jquery: true,
        jasmine: true
    },

    // http://eslint.org/docs/rules/
    rules: {
        'object-property-newline': 'off',
        'require-jsdoc': 'off',
        'no-console': 'off',
        'object-curly-newline': 'off',
        'no-magic-numbers': ['error', {
            ignore: [0, 1]
        }],
        'sort-imports': 'off'
    },

    // List of global variables.
    globals: {}
};
