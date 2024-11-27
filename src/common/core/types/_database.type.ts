import type { QueryConfig as PostgresqlQueryConfig } from 'pg';
import type { Class, EmptyObject } from 'type-fest';

import type { ReflectAble } from '~utils/reflect';

import type { DatabaseModuleType } from '../constants';
import type { IDatabaseModule } from '../interfaces';

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

/** Database Module options. */
export type DatabaseModuleOptions = PostgresqlModuleOptions;

/**
 * Database API base.
 *
 * @template C Query config type.
 * @template R Query result type.
 */
export type DatabaseApiBase<C, R> = {
  /** Close database connection. */
  close: () => Promise<void>;

  /**
   * Create query config.
   *
   * @param template Query string template.
   * @param values Query values.
   *
   * @returns Query config.
   */
  sql: (template: TemplateStringsArray, ...values: unknown[]) => C;

  /**
   * Execute query.
   *
   * @param sql Query config.
   *
   * @returns Query result.
   */
  query: (sql: C) => R;
};

/** Postgresql QueryResult. */
export type PostgresqlQueryResult = {
  /**
   * Map entity instances.
   *
   * @template T Entity type.
   * @param entity Entity class.
   *
   * @returns Entity instances.
   */
  mapEntity: <T extends object>(entity: Class<T>) => Promise<T[]>;
};

/** Postgresql Database API. */
export type PostgresqlDatabaseApi = DatabaseApiBase<PostgresqlQueryConfig, PostgresqlQueryResult>;

/** Database API. */
export type DatabaseApi = PostgresqlDatabaseApi;

/** Postgresql Database Module. */
export type PostgresqlDatabaseModule = IDatabaseModule<PostgresqlDatabaseApi>;
