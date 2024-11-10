import type { Class } from 'type-fest';

import { StringUtil } from '~utils/data-utility';
import { MetadataFactory } from '~utils/reflect';

import type { ClassDecorator, ControllerDecoratorOptions, ControllerMetadata } from '../types';

import { Injectable } from './_di.decorator';

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
      defineMetadata(constructor, {
        path: options,
      });
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
function defineMetadata<C>(constructor: Class<C>, { path }: ControllerDecoratorOptions): void {
  const controllerMetadata = MetadataFactory.create<ControllerMetadata>(constructor);

  const basePath = controllerMetadata.get('path');
  controllerMetadata.define({
    $kind: 'controller',
    name: constructor.name,
    path: StringUtil.resolvePath(basePath, path),
  });
}
