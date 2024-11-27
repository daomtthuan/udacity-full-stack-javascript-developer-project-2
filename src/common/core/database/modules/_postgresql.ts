import type { PoolClient, QueryArrayResult, QueryConfig } from 'pg';
import type { InjectionToken } from 'tsyringe';

import { cyan, green } from 'ansis';
import FileSystem from 'fs';
import Path from 'path';
import { Client, Pool } from 'pg';

import type { IDatabaseModuleFactory } from '../../interfaces';
import type { InjectionModule, PostgresqlDatabaseApi, PostgresqlDatabaseModule, PostgresqlModuleOptions, PostgresqlQueryResult } from '../../types';

import { DatabaseModuleType, MIGRATION_TABLE } from '../../constants';
import { Module } from '../../decorators';
import { DatabaseError } from '../../errors';
import { DatabaseModuleBase } from './_base';

/** Postgresql Module Factory Static. */
class PostgresqlModuleFactoryStatic implements IDatabaseModuleFactory<InjectionToken, PostgresqlModuleOptions, PostgresqlDatabaseApi> {
  createModule(token: InjectionToken, options: PostgresqlModuleOptions): InjectionModule<PostgresqlDatabaseModule> {
    @Module({ token })
    class PostgresqlModule extends DatabaseModuleBase<PostgresqlDatabaseApi> implements PostgresqlDatabaseModule {
      private _pool: Pool | undefined;

      constructor() {
        super(token, options);
      }

      protected async _init() {
        const { connection, migrations } = this.options;

        try {
          await this._createDatabase(connection.database);

          if (migrations) {
            await this._migrate(migrations);
          }
        } catch (error) {
          throw DatabaseError.fromError(error);
        }
      }

      protected async _createApi(): Promise<PostgresqlDatabaseApi> {
        const pool = this._createPool();

        return {
          sql: this._createSql.bind(this),

          query: (sql: QueryConfig): PostgresqlQueryResult => {
            if (sql.values?.length) {
              this._logger.debug(`Execute query:\n${green(sql.text)}\nParams:`, ...sql.values);
            } else {
              this._logger.debug(`Execute query:\n${green(sql.text)}`);
            }

            return {
              mapEntity: async (entity) => {
                let client;
                try {
                  client = await pool.connect();
                  const result = await client.query(sql);

                  return this._mapRow(entity, result.rows);
                } catch (error) {
                  throw DatabaseError.fromError(error);
                } finally {
                  client?.release();
                }
              },
            };
          },

          close: async () => {
            await pool.end();
            this._pool = undefined;
          },
        };
      }

      private _createSql(template: TemplateStringsArray, ...values: unknown[]): QueryConfig {
        const [queryText, queryParams] = template.reduce(
          (prev, part, i) => {
            const queryText = prev[0].trim();
            const queryValues = prev[1];

            const lint = part.trim().replace(/\s+/g, ' ');

            if (i >= values.length) {
              return [lint ? `${queryText} ${lint}` : queryText, queryValues];
            }

            const value = values[i];
            if (part.endsWith('$')) {
              queryValues.push(value);

              return [`${queryText} ${lint}${queryValues.length}`, queryValues];
            }

            return [`${queryText} ${lint} ${value}`, queryValues];
          },
          ['', []] as [string, unknown[]],
        );

        return {
          text: queryText,
          values: queryParams,
        };
      }

      private _createQuery(
        client: Client | PoolClient,
      ): <T extends unknown[]>(template: TemplateStringsArray, ...values: unknown[]) => Promise<QueryArrayResult<T>> {
        return async (template: TemplateStringsArray, ...values: unknown[]) => {
          const sql = this._createSql(template, ...values);
          if (sql.values?.length) {
            this._logger.debug(`Execute query:\n${green(sql.text)}\nParams:`, ...sql.values);
          } else {
            this._logger.debug(`Execute query:\n${green(sql.text)}`);
          }

          try {
            return await client.query({
              ...sql,
              rowMode: 'array',
            });
          } catch (error) {
            throw DatabaseError.fromError(error);
          }
        };
      }

      private async _createDatabase(database: string) {
        const client = new Client({
          ...this.options.connection,
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
        const client = new Client(this.options.connection);

        try {
          await client.connect();
          const sql = this._createQuery(client);

          this._logger.debug(`Create migration table ${cyan(table)} if not exists.`);

          await sql`
            CREATE TABLE IF NOT EXISTS ${table} (
              ${MIGRATION_TABLE.COLUMN.NAME} VARCHAR(255) PRIMARY KEY,
              ${MIGRATION_TABLE.COLUMN.APPLIED_AT} TIMESTAMP NOT NULL DEFAULT NOW()
            )
          `;

          const migrationsDir = Path.resolve(process.cwd(), dir);
          this._logger.debug(`Migreate scripts from ${cyan(migrationsDir)} directory.`);

          const migrationsResult = await sql`
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

            this._logger.info(`Apply migration ${cyan(script)}.`);

            const migrationSQL = FileSystem.readFileSync(scriptFile, 'utf-8');
            await client.query({
              rowMode: 'array',
              text: migrationSQL,
            });

            await sql`
              INSERT INTO
                ${table} ( ${MIGRATION_TABLE.COLUMN.NAME} )
              VALUES
                ( $${script} )
            `;
          }
        } catch (error) {
          throw DatabaseError.fromError(error);
        } finally {
          await client.end();
        }
      }

      private _createPool(): Pool {
        if (!this._pool) {
          this._pool = new Pool(this.options.connection);
        }

        return this._pool;
      }

      protected get _databaseUrl(): string {
        const { user, host, port, database } = this.options.connection;
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
