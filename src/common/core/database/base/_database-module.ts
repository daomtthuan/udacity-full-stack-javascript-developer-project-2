import type { InjectionToken } from 'tsyringe';
import type { Class } from 'type-fest';

import { cyan, green } from 'ansis';
import { PostgresqlRepositoryFactory } from 'src/common/core/database/postgresql/_repository-factory';

import { MetadataFactory, ReflectUtil } from '~utils/reflect';

import type { IAppLogger, IDatabaseModule, IRepository } from '../../interfaces';
import type { DatabaseApi, DatabaseModuleOptions, EntityMetadata, PostgresqlModuleOptions } from '../../types';

import { AppContainer } from '../../app';
import { CoreToken, DatabaseModuleType } from '../../constants';
import { ConfigurationError, DatabaseError } from '../../errors';

/**
 * Database Module Base.
 *
 * @template A Database API type.
 */
export abstract class DatabaseModuleBase<A extends DatabaseApi> implements IDatabaseModule<A> {
  private _isInitialized = false;

  protected readonly _logger: IAppLogger;

  constructor(
    protected readonly token: InjectionToken,
    protected readonly options: DatabaseModuleOptions,
  ) {
    const logger: IAppLogger = AppContainer.resolve(CoreToken.IAppLogger);

    this._logger = logger.createLogger('DatabaseModule');
    this._logger.debug('Initialized.');
  }

  async connect(): Promise<A & AsyncDisposable> {
    this._logger.debug(`Connect to database ${cyan(this._databaseUrl)}.`);

    const api = await this._createApi();

    return Object.assign(api, {
      [Symbol.asyncDispose]: async () => {
        this._logger.debug(`Disconnect from database ${green(this._databaseUrl)}.`);

        await api.close();
      },
    });
  }

  async init() {
    if (this._isInitialized) {
      this._logger.warn('Database module already initialized.');

      return;
    }

    this._logger.info(`Initialize database ${cyan(this._databaseUrl)}.`);

    await this._init();
    this._isInitialized = true;
  }

  createRepository<E extends object>(entityClass: Class<E>): IRepository<E> {
    const entityMetadata = MetadataFactory.create<EntityMetadata>('entity', entityClass);
    if (!entityMetadata) {
      throw new DatabaseError(`Entity ${entityClass.name} not decorated with @Entity.`);
    }

    this._logger.debug(`Create repository for entity ${green(entityClass.name)}.`);
    if (ReflectUtil.isType<PostgresqlModuleOptions>(this.options, DatabaseModuleType.Postgresql)) {
      return PostgresqlRepositoryFactory.create(entityClass);
    }

    throw new ConfigurationError('Database module type not supported.', this.options);
  }

  /** Initialize Database Module. */
  protected abstract _init(): Promise<void>;

  /**
   * Create Database API.
   *
   * @returns Database API.
   */
  protected abstract _createApi(): Promise<A>;

  /** Get Database URL. */
  protected abstract get _databaseUrl(): string;
}
