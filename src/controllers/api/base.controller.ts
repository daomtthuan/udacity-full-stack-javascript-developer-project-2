import { ControllerBase } from '~controllers/base.controller';
import { Controller } from '~core';

/** Api controller base. */
@Controller({
  basePath: '/api',
})
export class ApiControllerBase extends ControllerBase {}
