import type { DatabaseApi } from 'src/common/core/types';
import type { InjectionToken } from 'tsyringe';

import type { IAppLogger, IDatabaseModule } from '../../interfaces';

import { AppContainer } from '../../app';
import { InterfaceToken } from '../../constants';

/**
 * Database Module Abstract class.
 *
 * @template A Database API type.
 */
export abstract class DatabaseModule<A extends DatabaseApi> implements IDatabaseModule<A> {
  private _isInitialized = false;

  protected readonly _logger: IAppLogger;

  constructor(token: InjectionToken) {
    const logger: IAppLogger = AppContainer.resolve(InterfaceToken.IAppLogger);

    this._logger = logger.createLogger(token.toString());
    this._logger.debug('Initialized.');
  }

  async open(): Promise<A & AsyncDisposable> {
    await this._connect();

    return Object.assign(this._api, {
      [Symbol.asyncDispose]: async () => {
        await this.close();
      },
    });
  }

  async close(): Promise<void> {
    await this._disconnect();
  }

  async init(): Promise<void> {
    if (this._isInitialized) {
      this._logger.warn('Database module already initialized.');

      return;
    }

    try {
      await this._connect();
      await this._init();
    } finally {
      await this._disconnect();
    }

    this._isInitialized = true;
  }

  /** Connect to Database. */
  protected abstract _connect(): Promise<void>;

  /** Disconnect from Database. */
  protected abstract _disconnect(): Promise<void>;

  /** Initialize Database Module. */
  protected abstract _init(): Promise<void>;

  /** Get Database API. */
  protected abstract get _api(): A;
}
