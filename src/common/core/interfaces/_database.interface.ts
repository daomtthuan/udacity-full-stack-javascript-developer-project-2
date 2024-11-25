import type { InjectionToken } from 'tsyringe';
import type { Class } from 'type-fest';

import type { DatabaseApi, DatabaseModuleOptions, InjectionModule } from '../types';

/** Database Factory interface. */
export interface IDatabaseFactory {
  /**
   * Create Database Module.
   *
   * @param token Database module token.
   * @param options Database module options.
   *
   * @returns Database module.
   */
  createModule(token: InjectionToken, options: DatabaseModuleOptions): InjectionModule<IDatabaseModule<DatabaseApi>>;
}

/**
 * Database Module Factory interface.
 *
 * @template T Database module token.
 * @template O Database module options.
 * @template A Database API type.
 */
export interface IDatabaseModuleFactory<T extends InjectionToken, O extends DatabaseModuleOptions, A extends DatabaseApi> {
  /**
   * Create Database Module.
   *
   * @param token Database module token.
   * @param options Database module options.
   *
   * @returns Database module.
   */
  createModule(token: T, options: O): InjectionModule<IDatabaseModule<A>>;
}

/**
 * Database Module interface.
 *
 * @template A Database API type.
 */
export interface IDatabaseModule<A extends DatabaseApi> {
  /**
   * Open database connection.
   *
   * @returns Database API.
   */
  connect(): Promise<A & AsyncDisposable>;

  /** Initialize database. */
  init(): Promise<void>;

  /**
   * Create repository.
   *
   * @template E Entity type.
   * @param entity Entity class.
   */
  createRepository<E extends object>(entityClass: Class<E>): IRepository<E>;
}

/** Repository interface. */
export interface IRepository<E extends object> {
  /**
   * Add where clause.
   *
   * @param predicate Predicate function.
   *
   * @returns Repository.
   */
  where(predicate: (entity: E) => boolean): IRepository<E>;

  /**
   * Select entities.
   *
   * @template T Result type.
   * @param mapper Mapper function.
   *
   * @returns Selected entities.
   */
  select<T = E>(mapper?: (entity: E) => T): Promise<T[]>;
}
