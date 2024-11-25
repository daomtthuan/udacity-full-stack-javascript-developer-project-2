import { AppToken } from '~constants/di';
import { Module } from '~core';
import { ApiModule } from '~modules/api.module';
import { DatabaseModule } from '~modules/database.module';
import { LogAble } from '~utils/logger';

@Module({
  token: AppToken.IAppModule,

  modules: [DatabaseModule, ApiModule],
})
export class AppModule extends LogAble {}
