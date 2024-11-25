import type { ActionResultBody, IActionResult } from '~core';

import { ActionResult, HTTPStatusCode } from '~core';
import { LogAble } from '~utils/logger';

export abstract class BaseController extends LogAble {
  protected _ok<T extends ActionResultBody>(data: T): IActionResult<T> {
    return new ActionResult(HTTPStatusCode.OK, data);
  }
}
