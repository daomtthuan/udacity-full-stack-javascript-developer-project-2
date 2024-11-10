import type { IModule } from '~core';

import { Module } from '~core';
import { UserModule } from '~modules/api/user';
import { LogAble } from '~utils/logger';

@Module({
  modules: [UserModule],
})
export class AppModule extends LogAble implements IModule {}
