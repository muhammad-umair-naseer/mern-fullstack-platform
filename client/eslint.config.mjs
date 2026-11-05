import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import hooks from 'eslint-plugin-react-hooks';
export default [
  { ignores: ['build/**', 'node_modules/**', 'public/**'] },
  { files: ['src/**/*.{js,jsx}'], ...js.configs.recommended, languageOptions: { ecmaVersion: 'latest', sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } }, globals: { ...globals.browser, ...globals.es2021, process: 'readonly' } },
    plugins: { react, 'react-hooks': hooks }, settings: { react: { version: 'detect' } },
    rules: { ...react.configs.recommended.rules, 'react/no-unescaped-entities': 'off', 'react/prop-types': 'off', 'react/react-in-jsx-scope': 'off', 'react-hooks/rules-of-hooks': 'error', 'react-hooks/exhaustive-deps': 'warn', 'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrors: 'none' }], 'no-constant-condition': ['error', { checkLoops: false }] } },
  { files: ['src/**/*.test.{js,jsx}'], languageOptions: { globals: { ...globals.vitest } } },
];
