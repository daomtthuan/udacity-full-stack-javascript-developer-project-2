import { AppToken } from '~constants/di';
import { Module } from '~core';
import { LogAble } from '~utils/logger';

/** Auth module. */
@Module({
  token: AppToken.IAuthModule,

  controllers: [],
  providers: [],
})
export class AuthModule extends LogAble {}
