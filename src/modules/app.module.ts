import { Module } from '~core';
import { UserModule } from '~modules/api/user';
import { DatabaseModule } from '~modules/database.module';
import { LogAble } from '~utils/logger';

@Module({
  modules: [DatabaseModule, UserModule],
})
export class AppModule extends LogAble {}
