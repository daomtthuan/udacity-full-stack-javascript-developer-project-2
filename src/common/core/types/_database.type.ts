import type { QueryArrayResult, QueryResult } from 'pg';
import type { EmptyObject } from 'type-fest';

import type { ReflectAble } from '~utils/reflect';

import type { DatabaseModuleType } from '../constants';

/**
 * Database Module options base.
 *
 * @template T Database module type.
 * @template O Database module options.
 */
export type DatabaseModuleOptionsBase<T extends DatabaseModuleType, O extends object> = ReflectAble<
  T,
  {
    /** Postgresql connection options. */
    connection: {
      /** Host. */
      host: string;

      /** Port. */
      port: number;

      /** User. */
      user: string;

      /** Password. */
      password: string;

      /** Database. */
      database: string;
    };

    /** Migration options. */
    migrations?: {
      /** Migrations table. */
      table?: string | undefined;

      /** Migrations directory. */
      dir?: string | undefined;

      /** Migration scripts. */
      scripts?: string[] | undefined;
    };
  } & O
>;

/** Postgresql Module options. */
export type PostgresqlModuleOptions = DatabaseModuleOptionsBase<DatabaseModuleType.Postgresql, EmptyObject>;

/**
 * Database API base.
 *
 * @template A Database API type.
 */
export type DatabaseApiBase<A extends object> = A & {
  /** Close database connection. */
  close: () => Promise<void>;
};

/** Postgresql Database API. */
export type PostgresqlDatabaseApi = DatabaseApiBase<{
  /**
   * Execute query.
   *
   * @template T Result type.
   * @param template Query template.
   * @param values Query values.
   *
   * @returns Query result.
   */
  query: <T extends object>(template: TemplateStringsArray, ...values: unknown[]) => Promise<QueryResult<T>>;

  /**
   * Execute query array.
   *
   * @template T Result type.
   * @param template Query template.
   * @param values Query values.
   *
   * @returns Query result.
   */
  queryArray: <T extends unknown[]>(template: TemplateStringsArray, ...values: unknown[]) => Promise<QueryArrayResult<T>>;
}>;

/** Database Module options. */
export type DatabaseModuleOptions = PostgresqlModuleOptions;

/** Database API. */
export type DatabaseApi = PostgresqlDatabaseApi;
