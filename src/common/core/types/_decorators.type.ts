import type { Class, Constructor } from 'type-fest';

import type { IController, IModule, IProvider } from '../interfaces';

/**
 * Class decorator.
 *
 * @template T Class instance type.
 */
export type ClassDecorator = <T extends object>(constructor: Constructor<T>) => void;

/**
 * Method decorator.
 *
 * @template C Extends IController.
 */
export type MethodDecorator = <T extends object>(instance: T, propertyKey: string | symbol) => void;

/**
 * Property decorator.
 *
 * @template T Class instance type.
 */
export type ParameterDecorator = <T extends object>(instance: T, propertyKey: string | symbol, parameterIndex: number) => void;

/** Module Decorator options. */
export type ModuleDecoratorOptions = {
  /** Modules. */
  readonly modules?: Class<IModule>[];

  /** Controllers. */
  readonly controllers?: Class<IController>[];

  /** Providers. */
  readonly providers?: Class<IProvider>[];
};

/** Controller Decorator options. */
export type ControllerDecoratorOptions = {
  /** Path of the controller route. */
  readonly path?: string;
};

/** Action Decorator options. */
export type ActionDecoratorOptions = {
  /** Path of the action route. */
  readonly path?: string;
};
