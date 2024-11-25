import type { Class } from 'type-fest';

import type { PropertyDecorator, RelationDecoratorOptions } from '../../types';

export function ManyToOne<E extends object>(useEntity: () => Class<E>, options: RelationDecoratorOptions<E>): PropertyDecorator {
  return (target, propertyKey) => {};
}
