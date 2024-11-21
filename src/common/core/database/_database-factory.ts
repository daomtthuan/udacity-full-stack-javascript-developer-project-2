import type { InjectionToken } from 'tsyringe';

import { ReflectUtil } from '~utils/reflect';

import type { IAppLogger, IDatabaseFactory, IDatabaseModule } from '../interfaces';
import type { DatabaseApi, DatabaseModuleOptions, InjectionModule } from '../types';

import { AppContainer } from '../app';
import { DatabaseModuleType, InterfaceToken } from '../constants';
import { ConfigurationError } from '../errors';
import { PostgreSqlDatabaseModuleOptions } from '../types';
import { createPostgresqlDatabaseModule } from './modules';

/** Database Factory Static class. */
class DatabaseFactoryStatic implements IDatabaseFactory {
  private readonly _logger: IAppLogger;

  constructor() {
    this._logger = AppContainer.resolve<IAppLogger>(InterfaceToken.IAppLogger).createLogger('DatabaseFactory');

    this._logger.debug('Initialized.');
  }

  createModule<T extends InjectionToken, M extends InjectionModule<IDatabaseModule<DatabaseApi>>>(token: T, options: DatabaseModuleOptions): M {
    if (ReflectUtil.isType<PostgreSqlDatabaseModuleOptions>(options, DatabaseModuleType.Postgresql)) {
      return createPostgresqlDatabaseModule(token, options) as M;
    }

    throw new ConfigurationError('Database module type not supported.', options);
  }
}

/** Database Factory. */
export const DatabaseFactory: IDatabaseFactory = new DatabaseFactoryStatic();
