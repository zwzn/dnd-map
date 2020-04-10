module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint',
        'react-hooks',
    ],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
    ],
    settings: {
        "react": {
            "pragma": "createElement",
            "version": "detect",
        },
        "linkComponents": [
            { "name": "Link", "linkAttribute": "to" }
        ]
    },
    rules: {
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^h$' }],
        '@typescript-eslint/no-inferrable-types': 'off',
        '@typescript-eslint/explicit-function-return-type': ['warn', {
            allowExpressions: true,
            allowTypedFunctionExpressions: true,
            allowHigherOrderFunctions: true,
        }],
        'eqeqeq': ['warn', 'always'],
        'jsx-quotes': ["warn", "prefer-single"],
        'no-multiple-empty-lines': ["warn", { max: 1, maxEOF: 0, maxBOF: 0 }],
        'react-hooks/exhaustive-deps': 'warn',
        'react-hooks/rules-of-hooks': 'error',
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',
        'react/display-name': 'off',
        'semi': ["warn", "never"],
        "comma-dangle": ["warn", "always-multiline"],
        "indent": ["warn", 4],
    }
};