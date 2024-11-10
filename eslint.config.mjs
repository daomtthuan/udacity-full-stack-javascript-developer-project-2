/**
 * @import {Linter} from 'eslint'
 * @import {FlatConfig} from '@typescript-eslint/utils/ts-eslint'
 */

/** @typedef {(FlatConfig.Config | Linter.Config)[]} Configs */

import js from '@eslint/js';
import jsdoc from 'eslint-plugin-jsdoc';
import prettierConfig from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import ts from 'typescript-eslint';

/** @type {Configs} */
const envConfigs = [
  {
    ignores: ['node_modules/**/*', 'dist/**/*'],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
];

/** @type {Configs} */
const jsConfigs = [js.configs.recommended];

/** @type {Configs} */
const tsConfigs = ts.config(...ts.configs.recommended, {
  rules: {
    '@typescript-eslint/no-empty-object-type': [
      'error',
      {
        allowWithName: '^I',
      },
    ],
  },
});

/** @type {Configs} */
const jsdocConfigs = [
  {
    ...jsdoc.configs['flat/recommended'],
    files: ['**/*.js', '**/*.jsx'],
  },
  {
    ...jsdoc.configs['flat/recommended-typescript'],
    files: ['**/*.ts', '**/*.tsx'],
  },
].map((configs) => ({
  ...configs,
  rules: {
    ...configs.rules,
    'jsdoc/tag-lines': [
      'warn',
      'always',
      {
        count: 0,
        startLines: 1,
      },
    ],
    'jsdoc/require-param': [
      'off',
      {
        checkDestructured: false,
      },
    ],
    'jsdoc/require-returns': [
      'error',
      {
        checkGetters: false,
      },
    ],
    'jsdoc/check-param-names': [
      'off',
      {
        checkDestructured: false,
      },
    ],
  },
}));

/** @type {Configs} */
const prettierConfigs = [prettierConfig];

/** @type {Configs} */
const baseConfigs = [...envConfigs, ...jsConfigs, ...tsConfigs, ...jsdocConfigs];

export default [...baseConfigs, ...prettierConfigs];
