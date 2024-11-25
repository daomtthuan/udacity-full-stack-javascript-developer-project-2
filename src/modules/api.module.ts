import { AppToken } from '~constants/di';
import { UserController } from '~controllers/api/user.controller';
import { Module } from '~core';
import { UserService } from '~services/user.service';
import { LogAble } from '~utils/logger';

@Module({
  token: AppToken.IApiModule,

  controllers: [UserController],
  providers: [UserService],
})
export class ApiModule extends LogAble {}
