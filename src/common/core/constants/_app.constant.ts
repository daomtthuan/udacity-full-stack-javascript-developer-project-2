import type { Dictionary } from 'tsyringe/dist/typings/types';

import { blue, gray, red, yellow } from 'ansis';

/** Log Level Colors. */
export const LogLevelColor: Dictionary<string> = {
  debug: gray('DEBUG'),
  info: blue('INFO'),
  warn: yellow('WARN'),
  error: red('ERROR'),
} as const;
