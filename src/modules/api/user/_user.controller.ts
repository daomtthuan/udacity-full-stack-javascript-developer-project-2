import type { IController, Response } from '~core';

import { Controller, Get, Res, StatusCode } from '~core';
import { LogAble } from '~utils/logger';

@Controller({
  path: '/user',
})
export class UserController extends LogAble implements IController {
  @Get()
  getUsers(@Res() res: Response) {
    res.status(StatusCode.OK).json([
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
}
