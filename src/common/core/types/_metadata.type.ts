import type { Class } from 'type-fest';

import type { MetadataSchema } from '~utils/reflect';

import type { Method } from '../constants';
import type { IAppContainer, IController, IModule, IProvider } from '../interfaces';

/** Module metadata. */
export type ModuleMetadata = MetadataSchema<
  'module',
  {
    /** Modules. */
    readonly modules: Class<IModule>[];

    /** Controllers. */
    readonly controllers: Class<IController>[];

    /** Providers. */
    readonly providers: Class<IProvider>[];
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
    readonly method: Method;

    /** Parameters of the action. */
    readonly parameters: {
      /** Request parameter. */
      readonly request?: {
        /** Request parameter name. */
        readonly name: string | symbol;

        /** Request parameter index. */
        readonly index: number;
      };

      /** Response parameter. */
      readonly response?: {
        /** Response parameter name. */
        readonly name: string | symbol;

        /** Response parameter index. */
        readonly index: number;
      };

      /** Next parameter. */
      readonly next?: {
        /** Next parameter name. */
        readonly name: string | symbol;

        /** Next parameter index. */
        readonly index: number;
      };
    };
  }
>;
