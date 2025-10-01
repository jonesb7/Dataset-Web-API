/**
 * ESLint configuration for TCSS-460 HelloWorld API
 *
 * Educational configuration focusing on code quality and consistency
 * while maintaining readability for students learning Node.js and TypeScript.
 */

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
  ],
  root: true,
  env: {
    node: true,
    es2022: true,
  },
  rules: {
    // Code quality for educational clarity
    'no-console': 'off', // Allow console for educational logging
    'prefer-const': 'error',
    'no-var': 'error',
    'no-unused-vars': 'off', // Turn off base rule for TypeScript
    '@typescript-eslint/no-unused-vars': 'error',

    // Style preferences for educational clarity
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'comma-dangle': ['error', 'never'],

    // TypeScript-specific rules
    '@typescript-eslint/no-explicit-any': 'warn',
  },
  ignorePatterns: [
    'dist/**',
    'node_modules/**',
    '*.js' // Allow JS config files
  ]
};