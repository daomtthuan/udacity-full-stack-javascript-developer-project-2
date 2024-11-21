import Path from 'path';

import type { IAppConfig } from '../interfaces';
import type { DirectoryConfig, ServerConfig } from '../types';

import { Injectable } from '../decorators';
import { ConfigurationError } from '../errors';
import { AppEnv } from './_app-env';

/** Application Configuration. */
@Injectable()
export class AppConfig implements IAppConfig {
  readonly isProduction: boolean;
  readonly server: ServerConfig;
  readonly directory: DirectoryConfig;

  constructor() {
    this.isProduction = this._isProduction;
    this.server = this._serverConfig;
    this.directory = this._directoryConfig;
  }

  private get _isProduction(): boolean {
    const env = AppEnv.getString('NODE_ENV', 'development');

    return env === 'production';
  }

  private get _serverConfig(): ServerConfig {
    const host = AppEnv.getString('HOST', 'localhost');
    const port = AppEnv.getNumber('PORT', 3000);

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
    const logsDir = AppEnv.getString('LOGS_DIR', 'logs');

    if (typeof logsDir !== 'string' || !logsDir) {
      throw new ConfigurationError('Invalid logs directory.');
    }

    return {
      logs: Path.resolve(process.cwd(), logsDir),
    };
  }
}
