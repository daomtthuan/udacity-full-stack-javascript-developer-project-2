/** @import {Config} from 'jest' */

/** @type {Config} */
export default {
  bail: 5,
  collectCoverage: true,
  coverageDirectory: '<rootDir>/test/coverage',
  coverageProvider: 'v8',
  roots: ['<rootDir>/test/scripts'],
  slowTestThreshold: 5,
  testEnvironment: 'node',
  testLocationInResults: true,
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
  testPathIgnorePatterns: ['\\\\node_modules\\\\'],
  testRunner: 'jest-circus/runner',
  transform: { '^.+\\.(ts|tsx)$': 'ts-jest' },
  transformIgnorePatterns: ['\\\\node_modules\\\\'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  moduleNameMapper: {
    '~core': '<rootDir>/src/common/core',
    '~modules/(.*)': '<rootDir>/src/modules/$1',
    '~utils/(.*)': '<rootDir>/src/common/utils/$1',
  },
};
