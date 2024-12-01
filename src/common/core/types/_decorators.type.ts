import type { InjectionToken } from 'tsyringe';
import type { Class, Constructor } from 'type-fest';

import type { HTTPMethod, ProviderScope } from '../constants';
import type { AppModule } from './_app.type';

/**
 * Class decorator.
 *
 * @template T Class instance type.
 */
export type ClassDecorator = <T extends object>(constructor: Constructor<T>) => void;

/**
 * Property decorator.
 *
 * @template T Class instance type.
 */
export type PropertyDecorator = <T extends object>(target: T, propertyKey: string | symbol) => void;

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
  /** Token of the module. */
  readonly token?: InjectionToken;

  /** Modules. */
  readonly modules?: AppModule<object>[];

  /** Controllers. */
  readonly controllers?: Class<object>[];

  /** Providers. */
  readonly providers?: Class<object>[];
};

/** Controller Decorator options. */
export type ControllerDecoratorOptions = {
  /** Base path of the controller route. */
  readonly basePath?: string;

  /** Path of the controller route. */
  readonly path?: string;
};

/** Action Decorator options. */
export type ActionDecoratorOptions = {
  /** Method of the action route. */
  readonly method?: HTTPMethod;

  /** Path of the action route. */
  readonly path?: string;
};

/** Provider Decorator options. */
export type ProviderDecoratorOptions = {
  /** Token of the provider. */
  token?: InjectionToken;

  /** Lifecycle scope. */
  scope?: ProviderScope;
};

/** Entity Decorator options. */
export type EntityDecoratorOptions = {
  /** Table name. */
  readonly table: string;
};

/** Property Decorator options. */
export type PropertyDecoratorOptions = {
  /** Column name. */
  readonly column: string;
};

/**
 * Relation Decorator options.
 *
 * @template E Entity type.
 * @param entity Entity instance.
 */
export type RelationDecoratorOptions<E extends object> = (entity: E) => E[keyof E];
