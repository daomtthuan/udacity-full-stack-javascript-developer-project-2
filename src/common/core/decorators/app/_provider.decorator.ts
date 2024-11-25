import type { Class } from 'type-fest';

import { MetadataFactory } from '~utils/reflect';

import type { ClassDecorator, ProviderDecoratorOptions, ProviderMetadata } from '../../types';

import { ProviderScope } from '../../constants';
import { Injectable } from '../_di.decorator';

/**
 * Provider Decorator.
 *
 * @param options Provider Decorator options.
 *
 * @returns Provider Decorator.
 */
export function Provider(options: ProviderDecoratorOptions = {}): ClassDecorator {
  return (target) => {
    Injectable()(target);

    defineMetadata(target, options);
  };
}

/**
 * Define metadata.
 *
 * @template M Provider type.
 * @param constructor Provider class.
 * @param options Provider options.
 */
function defineMetadata<M extends object>(constructor: Class<M>, { token, scope = ProviderScope.Default }: ProviderDecoratorOptions) {
  const providerMetadata = MetadataFactory.create<ProviderMetadata>(constructor);

  providerMetadata.define({
    $kind: 'provider',
    token: token ?? constructor,
    scope,
  });
}
