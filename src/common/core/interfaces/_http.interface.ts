import type { RequestHandler } from 'express';

import type { HTTPStatusCode } from '../constants';
import type { ActionResultBody } from '../types';

/**
 * Action Result interface.
 *
 * @template T Action result type.
 */
export type IActionResult<T extends ActionResultBody = ActionResultBody> = {
  /** Status. */
  status: HTTPStatusCode;

  /** Body. */
  body: T;

  /** Resolve. */
  resolve: RequestHandler;
};
