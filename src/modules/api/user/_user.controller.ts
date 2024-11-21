import type { ActionResponse, IActionResult, IDatabaseModule, PostgreSqlDatabaseApi } from '~core';

import { AppToken } from '~constants/di';
import { ActionResult, Controller, Get, HTTPStatusCode, Inject, Param, Post, Res } from '~core';
import { LogAble } from '~utils/logger';

@Controller({
  path: '/users',
})
export class UserController extends LogAble {
  constructor(
    @Inject(AppToken.IDatabaseModule)
    private readonly _database: IDatabaseModule<PostgreSqlDatabaseApi>,
  ) {
    super();
  }

  @Get()
  getUsers(@Res() res: ActionResponse) {
    res.status(HTTPStatusCode.OK).json([
      {
        id: 1,
        name: 'John Doe',
      },
      {
        id: 2,
        name: 'Alice Quinn',
      },
    ]);
  }

  @Post('/:id')
  async editUser(@Param('id') id: string): Promise<IActionResult> {
    await using api = await this._database.open();

    const result = await api.query/*sql*/ `
      SELECT ${id} AS id;
    `;

    return new ActionResult(HTTPStatusCode.OK, result);
  }
}
