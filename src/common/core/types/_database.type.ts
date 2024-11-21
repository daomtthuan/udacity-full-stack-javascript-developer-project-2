import type { QueryResult } from 'pg';
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

/** Postgresql Database Module options. */
export type PostgreSqlDatabaseModuleOptions = DatabaseModuleOptionsBase<DatabaseModuleType.Postgresql, EmptyObject>;

/** Postgresql Database API. */
export type PostgreSqlDatabaseApi = {
  /**
   * Execute query.
   *
   * @param template Query template.
   * @param values Query values.
   *
   * @returns Query result.
   */
  query: <T extends object>(template: TemplateStringsArray, ...values: unknown[]) => Promise<QueryResult<T>>;
};

/** Database Module options. */
export type DatabaseModuleOptions = PostgreSqlDatabaseModuleOptions;

/** Database API. */
export type DatabaseApi = PostgreSqlDatabaseApi;
