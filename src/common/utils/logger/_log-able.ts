import type { IAppLogger } from '~core';

import { AppContainer, AppToken } from '~core';

/** Log-able. */
export abstract class LogAble {
  protected readonly _logger: IAppLogger;

  constructor() {
    const logger: IAppLogger = AppContainer.resolve(AppToken.IAppLogger);

    this._logger = logger.createLogger(this.constructor.name);
    this._logger.debug('Initialized.');
  }
}
