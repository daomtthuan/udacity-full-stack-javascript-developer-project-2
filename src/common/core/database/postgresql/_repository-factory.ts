import type { Class } from 'type-fest';

import type { IAppLogger, IRepository } from '../../interfaces';

import { AppContainer } from '../../app';
import { CoreToken } from '../../constants';

/** Postgresql Repository Factory Static. */
class PostgresqlRepositoryFactoryStatic {
  private readonly _logger: IAppLogger;

  constructor() {
    this._logger = AppContainer.resolve<IAppLogger>(CoreToken.IAppLogger).createLogger('RepositoryFactory');

    this._logger.debug('Initialized.');
  }

  public create<E extends object>(entity: Class<E>): IRepository<E> {
    throw new Error('Method not implemented.');
  }
}

/** Postgresql Repository Factory. */
export const PostgresqlRepositoryFactory = new PostgresqlRepositoryFactoryStatic();
