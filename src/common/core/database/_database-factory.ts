import type { InjectionToken } from 'tsyringe';

import { ReflectUtil } from '~utils/reflect';

import type { IAppLogger, IDatabaseFactory, IDatabaseModule } from '../interfaces';
import type { DatabaseApi, InjectionModule, PostgresqlModuleOptions } from '../types';

import { AppContainer } from '../app';
import { CoreToken, DatabaseModuleType } from '../constants';
import { ConfigurationError } from '../errors';
import { PostgresqlModuleFactory } from './modules';

/** Database Factory Static class. */
class DatabaseFactoryStatic implements IDatabaseFactory {
  private readonly _logger: IAppLogger;

  constructor() {
    this._logger = AppContainer.resolve<IAppLogger>(CoreToken.IAppLogger).createLogger('DatabaseFactory');

    this._logger.debug('Initialized.');
  }

  createModule(token: InjectionToken, options: PostgresqlModuleOptions): InjectionModule<IDatabaseModule<DatabaseApi>> {
    if (ReflectUtil.isType<PostgresqlModuleOptions>(options, DatabaseModuleType.Postgresql)) {
      return PostgresqlModuleFactory.createModule(token, options);
    }

    throw new ConfigurationError('Database module type not supported.', options);
  }
}

/** Database Factory. */
export const DatabaseFactory: IDatabaseFactory = new DatabaseFactoryStatic();
