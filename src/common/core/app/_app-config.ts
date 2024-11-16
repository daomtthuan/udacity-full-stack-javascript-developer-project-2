import DotENV from 'dotenv';
import Path from 'path';

import type { IAppConfig } from '../interfaces';
import type { DirectoryConfig, ServerConfig } from '../types';

import { DefaultAppConfig } from '../constants';
import { Injectable } from '../decorators';
import { ConfigurationError } from '../errors';

/** Application Configuration. */
@Injectable()
export class AppConfig implements IAppConfig {
  readonly mode: string | undefined;
  readonly isProduction: boolean;
  readonly server: ServerConfig;
  readonly directory: DirectoryConfig;

  constructor() {
    const modeParamIndex = process.argv.findIndex((arg) => arg === '--mode');
    this.mode = modeParamIndex >= 0 ? process.argv[modeParamIndex + 1] : undefined;

    this._loadEnv();

    this.isProduction = this._isProduction;
    this.server = this._serverConfig;
    this.directory = this._directoryConfig;
  }

  private _loadEnv() {
    if (this.mode) {
      const env = DotENV.config({ path: Path.resolve(process.cwd(), `.env.${this.mode}`) });
      if (env.error) {
        throw new ConfigurationError(`Failed to load environment variables for mode: ${this.mode}.`);
      }
    }

    const env = DotENV.config();
    if (env.error) {
      throw new ConfigurationError('Failed to load environment variables.');
    }
  }

  private get _isProduction(): boolean {
    const env = process.env['NODE_ENV'] || 'development';

    return env === 'production';
  }

  private get _serverConfig(): ServerConfig {
    const host = process.env['HOST'] || DefaultAppConfig.server.host;
    const port = Number(process.env['PORT'] || DefaultAppConfig.server.port);

    if (typeof host !== 'string' || !host) {
      throw new ConfigurationError('Invalid server host.');
    }

    if (typeof port !== 'number' || Number.isNaN(port) || port < 0 || port > 65535) {
      throw new ConfigurationError('Invalid server port.');
    }

    return {
      host,
      port,
    };
  }

  private get _directoryConfig(): DirectoryConfig {
    const logsDir = process.env['LOGS_DIR'] || DefaultAppConfig.directory.logs;

    if (typeof logsDir !== 'string' || !logsDir) {
      throw new ConfigurationError('Invalid logs directory.');
    }

    return {
      logs: Path.resolve(process.cwd(), logsDir),
    };
  }
}
