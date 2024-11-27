import type { PostgresqlDatabaseModule } from '~core';

import { AppToken } from '~constants/di';
import { Inject, Provider } from '~core';
import { User } from '~models/user';
import { LogAble } from '~utils/logger';

@Provider({
  token: AppToken.IUserService,
})
export class UserService extends LogAble {
  constructor(
    @Inject(AppToken.IDatabaseModule)
    private readonly _database: PostgresqlDatabaseModule,
  ) {
    super();
  }

  /**
   * Get all users.
   *
   * @returns Users.
   */
  async getUsers(): Promise<User[]> {
    this._logger.debug('Get users.');

    await using api = await this._database.connect();

    const usersSql = api.sql`
      SELECT *
      FROM users
    `;

    return await api.query(usersSql).mapEntity(User);
  }
}
