import { MetadataFactory } from '~utils/reflect';

import type { ActionMetadata, ParameterDecorator } from '../../types';

/**
 * Request Decorator.
 *
 * @returns Request Decorator.
 */
export function Req(): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    defineMetadata(target, 'request', propertyKey, parameterIndex);
  };
}

/**
 * Response Decorator.
 *
 * @returns Response Decorator.
 */
export function Res(): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    defineMetadata(target, 'response', propertyKey, parameterIndex);
  };
}

/**
 * Next Decorator.
 *
 * @returns Next Decorator.
 */
export function Next(): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    defineMetadata(target, 'next', propertyKey, parameterIndex);
  };
}

/**
 * Body Decorator.
 *
 * @returns Body Decorator.
 */
export function Body(): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    defineMetadata(target, 'body', propertyKey, parameterIndex);
  };
}

/**
 * Param Decorator.
 *
 * @param name Param name.
 *
 * @returns Param Decorator.
 */
export function Param(name: string): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    defineMetadataParam(target, name, propertyKey, parameterIndex);
  };
}

/**
 * Define metadata.
 *
 * @template A Action method type.
 * @param target Action method.
 * @param key Metadata key.
 * @param propertyKey Action property key.
 * @param parameterIndex Action parameter index.
 */
function defineMetadata<A extends object>(target: A, key: keyof ActionMetadata['parameters'], propertyKey: string | symbol, parameterIndex: number) {
  const actionMethodMetadata = MetadataFactory.create<ActionMetadata>(target, propertyKey);

  const baseParameters = actionMethodMetadata.get('parameters') ?? {};

  actionMethodMetadata.set('parameters', {
    ...baseParameters,
    [key]: {
      name: propertyKey,
      index: parameterIndex,
    },
  });
}

/**
 * Define metadata Params.
 *
 * @template A Action method type.
 * @param target Action method.
 * @param name Param name.
 * @param propertyKey Action property key.
 * @param parameterIndex Action parameter index.
 */
function defineMetadataParam<A extends object>(target: A, name: string, propertyKey: string | symbol, parameterIndex: number) {
  const actionMetadata = MetadataFactory.create<ActionMetadata>(target, propertyKey);

  const baseParameters = actionMetadata.get('parameters') ?? {};

  actionMetadata.set('parameters', {
    ...baseParameters,
    params: {
      ...baseParameters.params,
      [name]: {
        name: propertyKey,
        index: parameterIndex,
      },
    },
  });
}
