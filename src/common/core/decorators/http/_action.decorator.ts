import type { Except } from 'type-fest';

import { MetadataFactory } from '~utils/reflect';

import type {
  ActionDecoratorOptions,
  ActionMetadata,
  ControllerMetadata,
  MethodDecorator,
} from '../../types';

import { HTTPMethod } from '../../constants';

/**
 * Action Decorator.
 *
 * @param method Action method.
 * @param options Action Decorator options.
 *
 * @returns Action Decorator.
 */
function Action(options: ActionDecoratorOptions | string = {}): MethodDecorator {
  return (target, propertyKey) => {
    if (typeof options === 'string') {
      const path = options;

      defineMetadata(target, propertyKey, {
        path,
      });
    } else {
      defineMetadata(target, propertyKey, options);
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
export function Get(options: Except<ActionDecoratorOptions, 'method'> | string = {}): MethodDecorator {
  const method = HTTPMethod.Get;

  if (typeof options === 'string') {
    const path = options;

    return Action({ method, path });
  }

  return Action({ ...options, method });
}

/**
 * Post Action Decorator.
 *
 * @param options Action Decorator options.
 *
 * @returns Post Action Decorator.
 */
export function Post(options: Except<ActionDecoratorOptions, 'method'> | string = {}): MethodDecorator {
  const method = HTTPMethod.Post;

  if (typeof options === 'string') {
    const path = options;

    return Action({ method, path });
  }

  return Action({ ...options, method });
}

/**
 * Put Action Decorator.
 *
 * @param options Action Decorator options.
 *
 * @returns Put Action Decorator.
 */
export function Put(options: Except<ActionDecoratorOptions, 'method'> | string = {}): MethodDecorator {
  const method = HTTPMethod.Put;

  if (typeof options === 'string') {
    const path = options;

    return Action({ method, path });
  }

  return Action({ ...options, method });
}

/**
 * Patch Action Decorator.
 *
 * @param options Action Decorator options.
 *
 * @returns Patch Action Decorator.
 */
export function Patch(options: Except<ActionDecoratorOptions, 'method'> | string = {}): MethodDecorator {
  const method = HTTPMethod.Patch;

  if (typeof options === 'string') {
    const path = options;

    return Action({ method, path });
  }

  return Action({ ...options, method });
}

/**
 * Delete Action Decorator.
 *
 * @param options Action Decorator options.
 *
 * @returns Delete Action Decorator.
 */
export function Delete(options: Except<ActionDecoratorOptions, 'method'> | string = {}): MethodDecorator {
  const method = HTTPMethod.Delete;

  if (typeof options === 'string') {
    const path = options;

    return Action({ method, path });
  }

  return Action({ ...options, method });
}

/**
 * Define metadata.
 *
 * @template C Controller type.
 * @param target Controller.
 * @param propertyKey Property key.
 * @param options Action options.
 */
function defineMetadata<C extends object>(target: C, propertyKey: string | symbol, { method = HTTPMethod.Get, path = '' }: ActionDecoratorOptions) {
  const controllerMetadata = MetadataFactory.create<ControllerMetadata>(target.constructor);
  const actionMetadata = MetadataFactory.create<ActionMetadata>(target, propertyKey);

  const controllerActions = controllerMetadata.get('actions') ?? [];
  const baseParameters = actionMetadata.get('parameters') ?? {};

  controllerMetadata.set('actions', [...controllerActions, propertyKey]);

  actionMetadata.define({
    $kind: 'action',
    name: propertyKey,
    path,
    method,
    parameters: baseParameters,
  });
}
