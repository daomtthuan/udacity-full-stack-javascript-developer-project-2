import type { ActionResponse, IActionResult, IController } from '~core';

import { ActionResult, Controller, Get, Param, Post, Res, StatusCode } from '~core';
import { LogAble } from '~utils/logger';

@Controller({
  path: '/users',
})
export class UserController extends LogAble implements IController {
  @Get()
  getUsers(@Res() res: ActionResponse) {
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

  @Post('/:id')
  editUser(@Param('id') id: string): IActionResult {
    return new ActionResult(StatusCode.OK, {
      id,
    });
  }
}
