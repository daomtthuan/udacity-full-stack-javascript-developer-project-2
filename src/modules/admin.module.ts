import { AppToken } from '~constants/di';
import { UserController } from '~controllers/admin/user.controller';
import { Module } from '~core';
import { UserService } from '~services/user.service';
import { LogAble } from '~utils/logger';

/** Admin module. */
@Module({
  token: AppToken.IAdminModule,

  controllers: [UserController],
  providers: [UserService],
})
export class AdminModule extends LogAble {}
