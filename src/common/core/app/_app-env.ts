import DotENV from 'dotenv';
import Path from 'path';

import type { IAppEnv } from '../interfaces';

import { ConfigurationError } from '../errors';

/** Application Environment Static. */
class AppEnvStatic implements IAppEnv {
  readonly mode: string | undefined;

  constructor() {
    const modeParamIndex = process.argv.findIndex((arg) => arg === '--mode');
    this.mode = modeParamIndex >= 0 ? process.argv[modeParamIndex + 1] : undefined;

    this._loadEnvironment();
  }

  getString(key: string, defaultValue?: string): string {
    const value = process.env[key];
    if (value === undefined) {
      if (defaultValue !== undefined) {
        return defaultValue;
      }

      throw new ConfigurationError(`Environment variable not found: ${key}.`);
    }

    return value;
  }

  getNumber(key: string, defaultValue?: number): number {
    const value = process.env[key];
    if (value === undefined) {
      if (defaultValue !== undefined) {
        return defaultValue;
      }

      throw new ConfigurationError(`Environment variable not found: ${key}.`);
    }

    const number = Number(value);
    if (Number.isNaN(number)) {
      throw new ConfigurationError(`Environment variable is not a number: ${key}.`);
    }

    return number;
  }

  private _loadEnvironment() {
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
}

/** Application Environment. */
export const AppEnv: IAppEnv = new AppEnvStatic();
