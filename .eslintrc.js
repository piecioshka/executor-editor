module.exports = {
    extends: 'piecioshka',

    parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'script'
    },

    // https://eslint.org/docs/user-guide/configuring#specifying-environments
    env: {
        es6: true,
        browser: true,
        node: true,
        commonjs: true,
        amd: true,
        // jquery: true,
        jasmine: true
    },

    // https://eslint.org/docs/rules/
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

    overrides: [
        // TypeScript sources use the typescript-eslint parser. Several base
        // rules from eslint-config-piecioshka target CommonJS / plain JS idioms
        // and are off here because the type checker covers them or they clash
        // with TypeScript syntax (ES modules, type-only constructs).
        {
            files: ['src/**/*.ts'],
            parser: '@typescript-eslint/parser',
            parserOptions: {
                ecmaVersion: 2022,
                sourceType: 'module',
                project: './tsconfig.json'
            },
            plugins: ['@typescript-eslint'],
            rules: {
                'no-undef': 'off',
                'no-unused-vars': 'off',
                'no-magic-numbers': 'off',
                'no-implicit-globals': 'off',
                'no-redeclare': 'off',
                'no-undefined': 'off',
                'valid-jsdoc': 'off',
                'max-statements': 'off',
                'max-len': 'off',
                'quote-props': 'off',
                '@typescript-eslint/no-unused-vars': 'error'
            }
        },

        // Relax rules that are noise in Playwright end-to-end tests.
        {
            files: ['e2e/**/*.js', 'playwright.config.js'],
            rules: {
                'no-magic-numbers': 'off',
                'newline-per-chained-call': 'off',
                'no-implicit-coercion': 'off',
                'no-redeclare': 'off'
            }
        }
    ],

    // List of global variables.
    globals: {}
};
