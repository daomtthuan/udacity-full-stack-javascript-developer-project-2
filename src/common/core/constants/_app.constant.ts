import type { Dictionary } from 'tsyringe/dist/typings/types';

import { blue, gray, red, yellow } from 'ansis';

import type { IAppConfig } from '../interfaces';

/** Default Application Configuration. */
export const DefaultAppConfig: IAppConfig = {
  mode: undefined,
  isProduction: false,

  server: {
    host: 'localhost',
    port: 3000,
  },

  directory: {
    logs: 'logs',
  },
} as const;

/** Log Level Colors. */
export const LogLevelColor: Dictionary<string> = {
  debug: gray('DEBUG'),
  info: blue('INFO'),
  warn: yellow('WARN'),
  error: red('ERROR'),
} as const;
