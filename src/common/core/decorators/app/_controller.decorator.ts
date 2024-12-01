import type { Class } from 'type-fest';

import { StringUtil } from '~utils/data';
import { MetadataFactory } from '~utils/reflect';

import type { ClassDecorator, ControllerDecoratorOptions, ControllerMetadata } from '../../types';

import { Injectable } from '../_di.decorator';

/**
 * Controller Decorator.
 *
 * @param options Controller Decorator options.
 *
 * @returns Controller Decorator.
 */
export function Controller(options: ControllerDecoratorOptions | string = {}): ClassDecorator {
  return (constructor) => {
    Injectable()(constructor);

    if (typeof options === 'string') {
      const path = options;

      defineMetadata(constructor, { path });
    } else {
      defineMetadata(constructor, options);
    }
  };
}

/**
 * Define metadata.
 *
 * @template C Controller type.
 * @param constructor Controller class.
 * @param options Controller options.
 */
function defineMetadata<C extends object>(constructor: Class<C>, { basePath, path }: ControllerDecoratorOptions) {
  const controllerMetadata = MetadataFactory.create<ControllerMetadata>(constructor);

  const controllerBasePath = controllerMetadata.get('basePath') ?? '';
  const controllerBaseActions = controllerMetadata.get('actions') ?? [];

  controllerMetadata.define({
    $kind: 'controller',
    name: constructor.name,
    basePath: StringUtil.resolvePath(controllerBasePath, basePath),
    path: StringUtil.resolvePath(controllerBasePath, path),
    actions: controllerBaseActions,
  });
}
