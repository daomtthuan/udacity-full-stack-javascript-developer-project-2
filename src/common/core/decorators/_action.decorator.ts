import { MetadataFactory } from '~utils/reflect';

import type { ActionDecoratorOptions, ActionMetadata, MethodDecorator } from '../types';

import { Method } from '../constants';

/**
 * Action Decorator.
 *
 * @param method Action method.
 * @param options Action Decorator options.
 *
 * @returns Action Decorator.
 */
function Action(method: Method, options: ActionDecoratorOptions | string = {}): MethodDecorator {
  return (target, propertyKey) => {
    if (typeof options === 'string') {
      defineMetadata(target, propertyKey, method, {
        path: options,
      });
    } else {
      defineMetadata(target, propertyKey, method, options);
    }
  };
}

/**
 * Get Action Decorator.
 *
 * @param options Action Decorator options.
 *
 * @returns Get Action Decorator.
 */
export function Get(options: ActionDecoratorOptions | string = {}): MethodDecorator {
  return Action(Method.Get, options);
}

/**
 * Post Action Decorator.
 *
 * @param options Action Decorator options.
 *
 * @returns Post Action Decorator.
 */
export function Post(options: ActionDecoratorOptions | string = {}): MethodDecorator {
  return Action(Method.Post, options);
}

/**
 * Put Action Decorator.
 *
 * @param options Action Decorator options.
 *
 * @returns Put Action Decorator.
 */
export function Put(options: ActionDecoratorOptions | string = {}): MethodDecorator {
  return Action(Method.Put, options);
}

/**
 * Patch Action Decorator.
 *
 * @param options Action Decorator options.
 *
 * @returns Patch Action Decorator.
 */
export function Patch(options: ActionDecoratorOptions | string = {}): MethodDecorator {
  return Action(Method.Patch, options);
}

/**
 * Delete Action Decorator.
 *
 * @param options Action Decorator options.
 *
 * @returns Delete Action Decorator.
 */
export function Delete(options: ActionDecoratorOptions | string = {}): MethodDecorator {
  return Action(Method.Delete, options);
}

/**
 * Define metadata.
 *
 * @template A Action type.
 * @param target Action method.
 * @param propertyKey Property key.
 * @param method Action method.
 * @param options Action options.
 */
function defineMetadata<A extends object>(target: A, propertyKey: string | symbol, method: Method, { path = '' }: ActionDecoratorOptions) {
  const actionMetadata = MetadataFactory.create<ActionMetadata>(target, propertyKey);

  const baseParameters = actionMetadata.get('parameters') ?? {};

  actionMetadata.define({
    $kind: 'action',
    name: propertyKey,
    path,
    method,
    parameters: baseParameters,
  });
}
