import type { InjectionToken } from 'tsyringe';

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
}
