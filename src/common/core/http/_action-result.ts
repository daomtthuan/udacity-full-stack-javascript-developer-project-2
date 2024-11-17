import type { RequestHandler } from 'express';
import type { StatusCode } from 'src/common/core/constants';

import type { IActionResult } from '../interfaces';
import type { ActionResultBody } from '../types';

/**
 * Action Result.
 *
 * @template T Action result type.
 */
export class ActionResult<T extends ActionResultBody> implements IActionResult<T> {
  constructor(
    readonly status: StatusCode,
    readonly body: T,
  ) {}

  resolve(...[, response, next]: Parameters<RequestHandler>) {
    if (this.body === undefined || this.body === null) {
      response.sendStatus(this.status);
    } else {
      response.status(this.status).send(this.body);
    }

    return next();
  }
}
