import { AppToken } from '~constants/di';
import { Module } from '~core';
import { LogAble } from '~utils/logger';

/** Api module. */
@Module({
  token: AppToken.IApiModule,

  controllers: [],
  providers: [],
})
export class ApiModule extends LogAble {}
