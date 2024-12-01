import type { ActionResultBody, IActionResult } from '~core';

import { ActionResult, Controller, HTTPStatusCode } from '~core';
import { LogAble } from '~utils/logger';

/** Controller base. */
@Controller({
  basePath: '/',
})
export class ControllerBase extends LogAble {
  protected _ok<T extends ActionResultBody>(data: T): IActionResult<T> {
    return new ActionResult(HTTPStatusCode.OK, data);
  }
}
