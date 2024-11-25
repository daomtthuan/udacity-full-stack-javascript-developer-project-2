import type { IActionResult } from '~core';
import type { UserService } from '~services/user.service';

import { AppToken } from '~constants/di';
import { BaseController } from '~controllers/base.controller';
import { Controller, Get, Inject } from '~core';

@Controller({
  path: '/users',
})
export class UserController extends BaseController {
  constructor(
    @Inject(AppToken.IUserService)
    private readonly _userService: UserService,
  ) {
    super();
  }

  @Get()
  async getUsers(): Promise<IActionResult> {
    const users = await this._userService.getUsers();

    return this._ok(users);
  }
}
