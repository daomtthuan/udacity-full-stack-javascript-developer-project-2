import { ControllerBase } from '~controllers/base.controller';
import { Controller } from '~core';

/** Admin controller base. */
@Controller({
  basePath: '/admin',
})
export class AdminControllerBase extends ControllerBase {}
