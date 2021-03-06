module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es6: true,
        node: true,
        mocha: true,
    },
    extends: ['eslint:recommended', 'plugin:react/recommended'],
    parser: 'babel-eslint',
    parserOptions: {
      sourceType: 'module',
      allowImportExportEverywhere: true,

      // Enable JSX
      ecmaFeatures: {
        jsx: true,
      },
    },

    plugins: [
      'react',
    ],

    globals: {
      __: true,
    },

    rules: {
        'comma-dangle': ['error', 'always-multiline'],
        indent: ['error', "tab"],
        'linebreak-style': ['error', 'unix'],
        quotes: ['error', 'single'],
        semi: ['error', 'always'],
        'no-unused-vars': ['warn'],
        'no-console': 0,
    },
}