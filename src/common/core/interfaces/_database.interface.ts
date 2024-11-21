import type { InjectionToken } from 'tsyringe';

import type { DatabaseApi, DatabaseModuleOptions, InjectionModule } from '../types';

/** Database Factory interface. */
export interface IDatabaseFactory {
  /**
   * Create Database Module.
   *
   * @template T Database module token.
   * @template M Database module type.
   * @param token Database module token.
   * @param options Database module options.
   *
   * @returns Database module.
   */
  createModule<T extends InjectionToken, M extends InjectionModule<IDatabaseModule<DatabaseApi>>>(token: T, options: DatabaseModuleOptions): M;
}

/**
 * Database Module interface.
 *
 * @template A Database API type.
 */
export interface IDatabaseModule<A extends DatabaseApi> {
  /** Open database connection. */
  open(): Promise<A & AsyncDisposable>;

  /** Close database connection. */
  close(): Promise<void>;

  /** Initialize database. */
  init(): Promise<void>;
}
