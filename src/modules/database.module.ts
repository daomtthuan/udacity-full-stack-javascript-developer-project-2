import { AppToken } from '~constants/di';
import { AppEnv, DatabaseFactory, DatabaseModuleType } from '~core';
import { scripts } from '~database/migrations/register.json';

/** Create database module. */
export const DatabaseModule = DatabaseFactory.createModule(AppToken.IDatabaseModule, {
  $kind: DatabaseModuleType.Postgresql,
  connection: {
    host: AppEnv.getString('DATABASE_HOST'),
    port: AppEnv.getNumber('DATABASE_PORT'),
    user: AppEnv.getString('DATABASE_USER'),
    password: AppEnv.getString('DATABASE_PASSWORD'),
    database: AppEnv.getString('DATABASE_NAME'),
  },
  migrations: {
    dir: AppEnv.getString('DATABASE_MIGRATIONS_DIR'),
    scripts,
  },
});
