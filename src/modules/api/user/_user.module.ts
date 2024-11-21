import { Module } from '~core';
import { LogAble } from '~utils/logger';

import { UserController } from './_user.controller';

@Module({
  controllers: [UserController],
})
export class UserModule extends LogAble {}
