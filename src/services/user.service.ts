import type { IDatabaseModule, IRepository, PostgresqlDatabaseApi } from '~core';

import { AppToken } from '~constants/di';
import { EntityStatus } from '~constants/entity';
import { Inject, Provider } from '~core';
import { User } from '~models/user';
import { LogAble } from '~utils/logger';

@Provider({
  token: AppToken.IUserService,
})
export class UserService extends LogAble {
  private readonly _userRepository: IRepository<User>;

  constructor(
    @Inject(AppToken.IDatabaseModule)
    private readonly _database: IDatabaseModule<PostgresqlDatabaseApi>,
  ) {
    super();

    this._userRepository = this._database.createRepository(User);
  }

  async getUsers(): Promise<User[]> {
    this._logger.debug('Get users.');

    return this._userRepository.where((user) => user.status === EntityStatus.Active).select();
  }
}
