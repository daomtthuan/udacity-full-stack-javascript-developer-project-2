import type { IAppLogger } from '~core';

import { AppContainer, InterfaceToken } from '~core';

/** Log-able. */
export abstract class LogAble {
  protected readonly _logger: IAppLogger;

  constructor() {
    const logger: IAppLogger = AppContainer.resolve(InterfaceToken.IAppLogger);

    this._logger = logger.createLogger(this.constructor.name);
    this._logger.debug('Initialized.');
  }
}
