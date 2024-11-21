import type { Class } from 'type-fest';

import type { MetadataSchema } from '~utils/reflect';

import type { HTTPMethod } from '../constants';
import type { IAppContainer } from '../interfaces';
import type { AppModule } from './_app.type';

/** Module metadata. */
export type ModuleMetadata = MetadataSchema<
  'module',
  {
    /** Modules. */
    readonly modules: AppModule<object>[];

    /** Controllers. */
    readonly controllers: Class<object>[];

    /** Providers. */
    readonly providers: Class<object>[];
  }
>;

/** Module Instance metadata. */
export type ModuleInstanceMetadata = MetadataSchema<
  'module-instance',
  {
    /** Module Dependencies Container. */
    container: IAppContainer;
  }
>;

/** Controller metadata. */
export type ControllerMetadata = MetadataSchema<
  'controller',
  {
    /** Name of the controller. */
    readonly name: string | symbol;

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
