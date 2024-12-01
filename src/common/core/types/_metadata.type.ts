import type { InjectionToken } from 'tsyringe';
import type { Class } from 'type-fest';

import type { MetadataSchema } from '~utils/reflect';

import type { HTTPMethod, ProviderScope } from '../constants';
import type { AppModule } from './_app.type';

/** Module metadata. */
export type ModuleMetadata = MetadataSchema<
  'module',
  {
    /** Token of the module. */
    readonly token: InjectionToken;

    /** Modules. */
    readonly modules: AppModule<object>[];

    /** Controllers. */
    readonly controllers: Class<object>[];

    /** Providers. */
    readonly providers: Class<object>[];
  }
>;

/** Controller metadata. */
export type ControllerMetadata = MetadataSchema<
  'controller',
  {
    /** Name of the controller. */
    readonly name: string | symbol;

    /** Base path of the controller. */
    readonly basePath?: string | undefined;

    /** Path of the controller. */
    readonly path: string;

    /** Actions of the controller. */
    readonly actions: (string | symbol)[];
  }
>;

/** Action metadata. */
export type ActionMetadata = MetadataSchema<
  'action',
  {
    /** Name of the action. */
    readonly name: string | symbol;

    /** Path of the action. */
    readonly path: string;

    /** Method of the action. */
    readonly method: HTTPMethod;

    /** Parameters of the action. */
    readonly parameters: {
      readonly [key in 'request' | 'response' | 'next' | 'body']?: {
        /** Request parameter name. */
        readonly name: string | symbol;

        /** Request parameter index. */
        readonly index: number;
      };
    } & {
      /** Request parameter params. */
      params?: {
        /** Request parameter param name. */
        readonly [key in string]?: {
          /** Request parameter param name. */
          readonly name: string | symbol;

          /** Request parameter param index. */
          readonly index: number;
        };
      };
    };
  }
>;

/** Provider metadata. */
export type ProviderMetadata = MetadataSchema<
  'provider',
  {
    /** Token of the provider. */
    readonly token: InjectionToken;

    /** Scope of the provider. */
    readonly scope: ProviderScope;
  }
>;

/** Entity metadata. */
export type EntityMetadata = MetadataSchema<
  'entity',
  {
    /** Table name. */
    readonly table: string;

    /** Properties of the entity. */
    readonly properties: (string | symbol)[];
  }
>;

/** Property metadata. */
export type PropertyMetadata = MetadataSchema<
  'property',
  {
    /** Column name. */
    readonly column: string;
  }
>;
