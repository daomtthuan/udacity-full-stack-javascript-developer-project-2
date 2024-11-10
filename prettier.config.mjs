/**
 * @import {Config as PrettierOptions} from 'prettier'
 * @import {AllOptions as JsdocOptions} from 'prettier-plugin-jsdoc'
 */

/** @type {PrettierOptions} */
const prettierOptions = {
  printWidth: 160,
  quoteProps: 'consistent',
  singleAttributePerLine: true,
  singleQuote: true,
};

/** @type {Partial<JsdocOptions>} */
const jsdocOptions = {
  jsdocDescriptionWithDot: true,
  jsdocSeparateReturnsFromParam: true,
  jsdocPreferCodeFences: true,
};

/** @type {Partial<JsdocOptions>} */
const jsdocOptionsForTypeScript = {
  tsdoc: true,
};

export default {
  plugins: ['prettier-plugin-jsdoc'],

  ...prettierOptions,
  ...jsdocOptions,

  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      options: {
        ...jsdocOptionsForTypeScript,
      },
    },
  ],
};
