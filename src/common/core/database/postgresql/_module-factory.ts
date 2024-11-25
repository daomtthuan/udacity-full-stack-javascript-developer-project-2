import type { PoolClient, QueryArrayResult, QueryResult } from 'pg';
import type { InjectionToken } from 'tsyringe';

import { cyan, green } from 'ansis';
import FileSystem from 'fs';
import Path from 'path';
import { Client, Pool } from 'pg';

import type { IDatabaseModule, IDatabaseModuleFactory } from '../../interfaces';
import type { InjectionModule, PostgresqlDatabaseApi, PostgresqlModuleOptions } from '../../types';

import { DatabaseModuleType, MIGRATION_TABLE } from '../../constants';
import { Module } from '../../decorators';
import { DatabaseError } from '../../errors';
import { DatabaseModuleBase } from '../base/_database-module';

/** Postgresql Module Factory Static. */
class PostgresqlModuleFactoryStatic implements IDatabaseModuleFactory<InjectionToken, PostgresqlModuleOptions, PostgresqlDatabaseApi> {
  createModule(token: InjectionToken, options: PostgresqlModuleOptions): InjectionModule<IDatabaseModule<PostgresqlDatabaseApi>> {
    @Module({ token })
    class PostgresqlModule extends DatabaseModuleBase<PostgresqlDatabaseApi> implements IDatabaseModule<PostgresqlDatabaseApi> {
      private _pool: Pool | undefined;

      constructor() {
        super(token, options);
      }

      protected async _init() {
        try {
          await this._createDatabase(super.options.connection.database);

          if (super.options.migrations) {
            await this._migrate(super.options.migrations);
          }
        } catch (error) {
          throw DatabaseError.fromError(error);
        }
      }

      protected async _createApi(): Promise<PostgresqlDatabaseApi> {
        const pool = this._createPool();

        return {
          query: async <T extends object>(template: TemplateStringsArray, ...values: unknown[]): Promise<QueryResult<T>> => {
            let client;
            try {
              client = await pool.connect();
              const sql = this._createQuery(client);

              return await sql(template, ...values);
            } catch (error) {
              throw DatabaseError.fromError(error);
            } finally {
              client?.release();
            }
          },

          queryArray: async <T extends unknown[]>(template: TemplateStringsArray, ...values: unknown[]): Promise<QueryArrayResult<T>> => {
            let client;
            try {
              client = await pool.connect();
              const sql = this._createQueryArray(client);

              return await sql(template, ...values);
            } catch (error) {
              throw DatabaseError.fromError(error);
            } finally {
              client?.release();
            }
          },

          close: async () => {
            await pool.end();
            this._pool = undefined;
          },
        };
      }

      private _createQuery(client: Client | PoolClient): <T extends object>(template: TemplateStringsArray, ...values: unknown[]) => Promise<QueryResult<T>> {
        return async (template, ...values) => {
          try {
            const [queryText, queryParams] = template.reduce(
              ([prevQueryText, prevParams]: [string, unknown[]], part, i) => {
                const lint = part.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ');

                if (i >= values.length) {
                  return [lint ? `${prevQueryText} ${lint}` : prevQueryText, prevParams] as [string, unknown[]];
                }

                const value = values[i];

                if (part.endsWith('$')) {
                  prevParams.push(value);

                  return [`${prevQueryText} ${lint}${prevParams.length}`, prevParams] as [string, unknown[]];
                }

                return [`${prevQueryText} ${lint} ${value}`, prevParams] as [string, unknown[]];
              },
              ['', []],
            );

            if (queryParams.length) {
              this._logger.debug(`Execute query:\n${green(queryText)}\nParams:`, ...queryParams);
            } else {
              this._logger.debug(`Execute query:\n${green(queryText)}`);
            }

            return await client.query({
              text: queryText,
              values: queryParams,
            });
          } catch (error) {
            throw DatabaseError.fromError(error);
          }
        };
      }

      private _createQueryArray(
        client: Client | PoolClient,
      ): <T extends unknown[]>(template: TemplateStringsArray, ...values: unknown[]) => Promise<QueryArrayResult<T>> {
        return async (template, ...values) => {
          try {
            const [queryText, queryParams] = template.reduce(
              ([prevQueryText, prevParams]: [string, unknown[]], part, i) => {
                const lint = part.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ');

                if (i >= values.length) {
                  return [lint ? `${prevQueryText} ${lint}` : prevQueryText, prevParams] as [string, unknown[]];
                }

                const value = values[i];

                if (part.endsWith('$')) {
                  prevParams.push(value);

                  return [`${prevQueryText} ${lint}${prevParams.length}`, prevParams] as [string, unknown[]];
                }

                return [`${prevQueryText} ${lint} ${value}`, prevParams] as [string, unknown[]];
              },
              ['', []],
            );

            if (queryParams.length) {
              this._logger.debug(`Execute query:\n${green(queryText)}\nParams:`, ...queryParams);
            } else {
              this._logger.debug(`Execute query:\n${green(queryText)}`);
            }

            return await client.query({
              rowMode: 'array',
              text: queryText,
              values: queryParams,
            });
          } catch (error) {
            throw DatabaseError.fromError(error);
          }
        };
      }

      private async _createDatabase(database: string) {
        const client = new Client({
          ...super.options.connection,
          database: 'postgres',
        });

        try {
          await client.connect();
          const sql = this._createQuery(client);

          const databases = await sql`
            SELECT 1
            FROM pg_catalog.pg_database
            WHERE datname = $${database}
          `;

          if (databases.rows.length) {
            return;
          }

          this._logger.info(`Database ${cyan(database)} not exists. Create database automatically.`);

          await sql`
            CREATE DATABASE ${database}
          `;
        } catch (error) {
          throw DatabaseError.fromError(error);
        } finally {
          await client.end();
        }
      }

      private async _migrate({ table = MIGRATION_TABLE.NAME, dir = '', scripts = [] }: NonNullable<PostgresqlModuleOptions['migrations']>) {
        const client = new Client(super.options.connection);

        try {
          await client.connect();
          const sql = this._createQueryArray(client);

          this._logger.debug(`Create migration table ${cyan(table)} if not exists.`);

          await sql`
            CREATE TABLE IF NOT EXISTS ${table} (
              ${MIGRATION_TABLE.COLUMN.NAME} VARCHAR(255) PRIMARY KEY,
              ${MIGRATION_TABLE.COLUMN.APPLIED_AT} TIMESTAMP NOT NULL DEFAULT NOW()
            )
          `;

          const migrationsDir = Path.resolve(process.cwd(), dir);
          this._logger.debug(`Migreate scripts from ${cyan(migrationsDir)} directory.`);

          const migrationsResult = await sql<[string]>`
            SELECT ${MIGRATION_TABLE.COLUMN.NAME}
            FROM ${table}
          `;

          const migrationNames = migrationsResult.rows.flat();
          const needMigrations = scripts.filter((script) => !migrationNames.includes(script));
          if (!needMigrations.length) {
            this._logger.info('All migrations already applied.');
            return;
          }

          for (const script of needMigrations) {
            const scriptFile = Path.resolve(migrationsDir, script);

            const migrationSQL = FileSystem.readFileSync(scriptFile, 'utf-8');
            await client.query({
              rowMode: 'array',
              text: migrationSQL,
            });

            await sql`
              INSERT INTO ${table} (
                ${MIGRATION_TABLE.COLUMN.NAME}
              )
              VALUES (
                $${script}
              )
            `;

            this._logger.info(`Applied migration ${cyan(script)}.`);
          }
        } catch (error) {
          throw DatabaseError.fromError(error);
        } finally {
          await client.end();
        }
      }

      private _createPool(): Pool {
        if (!this._pool) {
          this._pool = new Pool(super.options.connection);
        }

        return this._pool;
      }

      protected get _databaseUrl(): string {
        const { user, host, port, database } = super.options.connection;
        return `${DatabaseModuleType.Postgresql}://${user}:__PASSWORD__@${host}:${port}/${database}`;
      }
    }

    return {
      module: PostgresqlModule,

      onRegister: async (module) => {
        await module.init();
      },
    };
  }
}

/** Postgresql Module Factory. */
export const PostgresqlModuleFactory: IDatabaseModuleFactory<InjectionToken, PostgresqlModuleOptions, PostgresqlDatabaseApi> =
  new PostgresqlModuleFactoryStatic();
