// @ts-check

import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import jest from 'eslint-plugin-jest';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';

export default defineConfig(
  {
    settings: {
      react: { version: 'detect' },
    },
    files: ['{js,test}/**/*.{ts,tsx}'],
    extends: [
      eslint.configs.recommended,
      react.configs.flat.recommended,
      tseslint.configs.recommended,
      jsxA11y.flatConfigs.recommended,
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript,
    ],
  },
  {
    files: ['test/**/*.{ts,tsx}'],
    extends: [jest.configs['flat/recommended']],
  },
);
