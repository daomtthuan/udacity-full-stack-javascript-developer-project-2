import type { Request, Response } from 'express';
import type { Primitive } from 'type-fest';

/** Action Request. */
export type ActionRequest = Request;

/** Action Response. */
export type ActionResponse = Response;

/** Action Result Body. */
export type ActionResultBody = Buffer | Primitive | object;
