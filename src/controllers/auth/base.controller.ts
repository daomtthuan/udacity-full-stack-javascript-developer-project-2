import { ControllerBase } from '~controllers/base.controller';
import { Controller } from '~core';

/** Auth controller base. */
@Controller({
  basePath: '/auth',
})
export class AuthControllerBase extends ControllerBase {}
