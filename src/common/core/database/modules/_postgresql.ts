import type { InjectionToken } from 'tsyringe';

import { cyan, green } from 'ansis';
import FileSystem from 'fs';
import Path from 'path';
import { Client, DatabaseError as PostgresqlDatabaseError, type QueryResult } from 'pg';

import type { IDatabaseModule } from '../../interfaces';
import type { InjectionModule, PostgreSqlDatabaseApi, PostgreSqlDatabaseModuleOptions } from '../../types';

import { DatabaseModuleType, MIGRATION_TABLE } from '../../constants';
import { Module } from '../../decorators';
import { DatabaseError } from '../../errors';
import { DatabaseModule } from './_base';

/**
 * Create Postgresql Database Module.
 *
 * @param token Database module token.
 * @param options Database module options.
 *
 * @returns Postgresql Database Module.
 */
export function createPostgresqlDatabaseModule(
  token: InjectionToken,
  { connection, migrations }: PostgreSqlDatabaseModuleOptions,
): InjectionModule<IDatabaseModule<PostgreSqlDatabaseApi>> {
  const { host, port, user, password, database } = connection;

  @Module()
  class PostgreSqlDatabaseModule extends DatabaseModule<PostgreSqlDatabaseApi> {
    private _client: Client | undefined;

    constructor() {
      super(token);
    }

    protected async _connect() {
      this._logger.debug(`Connect to database ${cyan(this._databaseUrl)}.`);
      this._client = new Client({
        host,
        port,
        user,
        password,
        database,
      });

      try {
        await this._client.connect();
      } catch (error) {
        if (error instanceof PostgresqlDatabaseError && error.code === '3D000' && error.message.includes(database)) {
          this._logger.info(`Database ${cyan(database)} not exists. Create database automatically.`);

          await this._client.end();
          await this._createDatabaseIfNotExists();

          this._logger.debug(`Reconnect to database ${cyan(this._databaseUrl)}.`);
          this._client = new Client({
            host,
            port,
            user,
            password,
            database,
          });

          try {
            await this._client.connect();

            await this._query()/* sql */ `
              CREATE TABLE ${MIGRATION_TABLE.NAME} (
                ${MIGRATION_TABLE.COLUMN.NAME} VARCHAR(255) PRIMARY KEY,
                ${MIGRATION_TABLE.COLUMN.APPLIED_AT} TIMESTAMP DEFAULT NOW()
              )
            `;

            this._logger.info(`Created migration table ${cyan(MIGRATION_TABLE.NAME)}.`);

            return;
          } catch (error) {
            throw DatabaseError.fromError(error);
          }
        }

        throw DatabaseError.fromError(error);
      }
    }

    protected async _disconnect() {
      if (!this._client) {
        return;
      }

      this._logger.debug(`Disconnect from database ${cyan(this._databaseUrl)}.`);
      try {
        await this._client.end();
        this._client = undefined;
      } catch (error) {
        throw DatabaseError.fromError(error);
      }
    }

    protected async _init() {
      this._logger.info(`Initialize database ${cyan(this._databaseUrl)}.`);

      try {
        if (migrations) {
          await this._migrate(migrations);
        }
      } catch (error) {
        throw DatabaseError.fromError(error);
      }
    }

    protected get _api(): PostgreSqlDatabaseApi {
      return {
        query: async <T extends object>(template: TemplateStringsArray, ...values: unknown[]) => {
          return await this._query<T>()(template, ...values);
        },
      };
    }

    private _query<T extends object>(
      client: Client | undefined = this._client,
    ): (template: TemplateStringsArray, ...values: unknown[]) => Promise<QueryResult<T>> {
      if (!client) {
        throw new DatabaseError('Database client not initialized.');
      }

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

          return await client.query<T>(queryText, queryParams);
        } catch (error) {
          throw DatabaseError.fromError(error);
        }
      };
    }

    private async _createDatabaseIfNotExists() {
      const adminClient = new Client({
        host,
        port,
        user,
        password,
        database: 'postgres',
      });

      try {
        await adminClient.connect();
        const databases = await this._query(adminClient)/* sql */ `
          SELECT datname
          FROM pg_catalog.pg_database
          WHERE datname = $${database}
        `;

        if (!databases.rows.length) {
          await this._query(adminClient)/* sql */ `
            CREATE DATABASE ${database}
          `;

          this._logger.info(`Created database ${cyan(database)}.`);
        }
      } catch (error) {
        throw DatabaseError.fromError(error);
      } finally {
        await adminClient.end();
      }
    }

    private async _migrate({ table = MIGRATION_TABLE.NAME, dir = '', scripts = [] }: NonNullable<PostgreSqlDatabaseModuleOptions['migrations']>) {
      if (!this._client) {
        throw new DatabaseError('Database client not initialized.');
      }

      const migrationsDir = Path.resolve(process.cwd(), dir);
      for (const script of scripts) {
        const scriptFile = Path.resolve(migrationsDir, script);
        const scriptName = Path.basename(scriptFile, Path.extname(scriptFile));

        const migrations = await this._query()/* sql */ `
          SELECT name
          FROM ${table}
          WHERE name = $${scriptName}
        `;

        if (migrations.rows.length) {
          this._logger.debug(`Migration ${scriptName} already applied.`);
          return;
        }

        const migrationSQL = FileSystem.readFileSync(scriptFile, 'utf-8');
        await this._client.query(migrationSQL);

        await this._query()/* sql */ `
          INSERT INTO ${table} (
            ${MIGRATION_TABLE.COLUMN.NAME}
          )
          VALUES (
            $${scriptName}
          )
        `;

        this._logger.debug(`Applied migration ${cyan(scriptName)}.`);
      }
    }

    private get _databaseUrl(): string {
      return `${DatabaseModuleType.Postgresql}://${user}:__PASSWORD__@${host}:${port}/${database}`;
    }
  }

  return {
    token,
    module: PostgreSqlDatabaseModule,

    onResolved: async (module) => {
      await module.init();
    },
  };
}
