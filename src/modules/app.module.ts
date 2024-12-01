import { AppToken } from '~constants/di';
import { Module } from '~core';
import { AdminModule } from '~modules/admin.module';
import { ApiModule } from '~modules/api.module';
import { AuthModule } from '~modules/auth.module';
import { DatabaseModule } from '~modules/database.module';
import { LogAble } from '~utils/logger';

@Module({
  token: AppToken.IAppModule,

  modules: [DatabaseModule, AuthModule, AdminModule, ApiModule],
})
export class AppModule extends LogAble {}
