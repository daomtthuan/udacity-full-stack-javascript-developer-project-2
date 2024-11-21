import type { Class } from 'type-fest';

import { MetadataFactory } from '~utils/reflect';

import type { ClassDecorator, ModuleDecoratorOptions, ModuleMetadata } from '../../types';

import { Singleton } from '../_di.decorator';

/**
 * Module Decorator.
 *
 * @param options Module Decorator options.
 *
 * @returns Module Decorator.
 */
export function Module(options: ModuleDecoratorOptions = {}): ClassDecorator {
  return (target) => {
    Singleton()(target);

    defineMetadata(target, options);
  };
}

/**
 * Define metadata.
 *
 * @template M Module type.
 * @param constructor Module class.
 * @param options Module options.
 */
function defineMetadata<M extends object>(constructor: Class<M>, { controllers = [], modules = [], providers = [] }: ModuleDecoratorOptions) {
  const moduleMetadata = MetadataFactory.create<ModuleMetadata>(constructor);

  const baseModules = moduleMetadata.get('modules') ?? [];
  const baseControllers = moduleMetadata.get('controllers') ?? [];
  const baseProviders = moduleMetadata.get('providers') ?? [];

  moduleMetadata.define({
    $kind: 'module',
    controllers: [...baseControllers, ...controllers],
    providers: [...baseProviders, ...providers],
    modules: [...baseModules, ...modules],
  });
}
