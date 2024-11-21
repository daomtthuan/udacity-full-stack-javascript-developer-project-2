import { MetadataFactory } from '~utils/reflect';

import type { EntityMetadata, PropertyDecorator, PropertyDecoratorOptions, PropertyMetadata } from '../../types';

export function Property(options: PropertyDecoratorOptions | string): PropertyDecorator {
  return (target, propertyKey) => {
    if (typeof options === 'string') {
      const column = options;

      defineMetadata(target, propertyKey, {
        column,
      });
    } else {
      defineMetadata(target, propertyKey, options);
    }
  };
}

/**
 * Define metadata.
 *
 * @template E Entity type.
 * @param target Entity.
 * @param propertyKey Property key.
 * @param options Property options.
 */
function defineMetadata<E extends object>(target: E, propertyKey: string | symbol, { column }: PropertyDecoratorOptions) {
  const entityMetadata = MetadataFactory.create<EntityMetadata>(target.constructor);
  const propertyMetadata = MetadataFactory.create<PropertyMetadata>(target, propertyKey);

  const entityProperties = entityMetadata.get('properties') ?? [];

  entityMetadata.set('properties', [...entityProperties, propertyKey]);

  propertyMetadata.define({
    $kind: 'property',
    column,
  });
}
