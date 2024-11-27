import type { Class } from 'type-fest';

import { MetadataFactory } from '~utils/reflect';

import type { ClassDecorator, EntityDecoratorOptions, EntityMetadata } from '../../types';

/**
 * Entity Decorator.
 *
 * @param options Entity Decorator options.
 *
 * @returns Entity Decorator.
 */
export function Entity(options: EntityDecoratorOptions | string): ClassDecorator {
  return function (constructor) {
    if (typeof options === 'string') {
      const table = options;

      defineMetadata(constructor, { table });
    } else {
      defineMetadata(constructor, options);
    }
  };
}

/**
 * Define metadata.
 *
 * @template E Entity type.
 * @param constructor Entity class.
 * @param options Entity options.
 */
function defineMetadata<E extends object>(constructor: Class<E>, { table }: EntityDecoratorOptions) {
  const controllerMetadata = MetadataFactory.create<EntityMetadata>(constructor);

  const baseProperties = controllerMetadata.get('properties') ?? [];

  controllerMetadata.define({
    $kind: 'entity',
    table,
    properties: baseProperties,
  });
}
