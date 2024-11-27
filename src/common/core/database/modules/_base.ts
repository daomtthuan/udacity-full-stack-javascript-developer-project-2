import type { InjectionToken } from 'tsyringe';
import type { Class } from 'type-fest';

import { cyan, green } from 'ansis';

import { MetadataFactory } from '~utils/reflect';

import type { IAppLogger, IDatabaseModule } from '../../interfaces';
import type { DatabaseApi, DatabaseModuleOptions, EntityMetadata, PropertyMetadata } from '../../types';

import { AppContainer } from '../../app';
import { CoreToken } from '../../constants';
import { DefinitionError } from '../../errors';

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

  /** Initialize Database Module. */
  protected abstract _init(): Promise<void>;

  /**
   * Create Database API.
   *
   * @returns Database API.
   */
  protected abstract _createApi(): Promise<A>;

  protected _mapRow<T extends object>(entityClass: Class<T>, rows: Record<string, unknown>[]): T[] {
    const entityMetadata = MetadataFactory.create<EntityMetadata>('entity', entityClass);
    if (!entityMetadata) {
      throw new DefinitionError(`Class ${entityClass.name} not decorated with @Entity.`);
    }

    const properties = entityMetadata.get('properties') ?? [];

    return rows.map((row) => {
      const entityInstance = new entityClass();

      properties.forEach((property) => {
        const propertyMetadata = MetadataFactory.create<PropertyMetadata>('property', entityInstance, property);
        if (!propertyMetadata) {
          throw new DefinitionError(`Property ${String(property)} not decorated with @Property.`);
        }

        const column = propertyMetadata.get('column') ?? '';
        if (!column) {
          return;
        }

        entityInstance[property as keyof T] = row[column] as T[keyof T];
      });

      return entityInstance;
    });

    return [];
  }

  /** Get Database URL. */
  protected abstract get _databaseUrl(): string;
}
