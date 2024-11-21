import type { Server } from 'http';
import type { Class } from 'type-fest';

import { cyan, gray, green } from 'ansis';
import Compression from 'compression';
import Express, { type RequestHandler } from 'express';
import Helmet from 'helmet';

import type { IMetadata } from '~utils/reflect';

import { StringUtil } from '~utils/data';
import { MetadataFactory } from '~utils/reflect';

import type { IApp, IAppConfig, IAppFactory, IAppLogger } from '../interfaces';
import type { AppModule } from '../types';

import { HTTPMethod, HTTPStatusCode, InterfaceToken } from '../constants';
import { DefinitionError, ReflectionError, ServerError } from '../errors';
import { ActionResult } from '../http';
import { ActionMetadata, ControllerMetadata, ModuleInstanceMetadata, ModuleMetadata } from '../types';
import { AppContainer } from './_app-container';

/** Application Factory Static. */
class AppFactoryStatic implements IAppFactory {
  private readonly _mode: string | undefined;
  private readonly _config: IAppConfig;
  private readonly _logger: IAppLogger;

  constructor() {
    this._config = AppContainer.resolve<IAppConfig>(InterfaceToken.IAppConfig);
    this._logger = AppContainer.resolve<IAppLogger>(InterfaceToken.IAppLogger).createLogger('App');

    this._logger.debug('Initialized.');
  }

  async create<M extends Class<object>>(module: M): Promise<IApp> {
    this._logger.info(`Application with mode: ${cyan(this._mode ?? 'default')}, isProduction: ${cyan(this._config.isProduction ? 'true' : 'false')}.`);

    const app = Express();
    this._registerMiddlewares(app);
    await this._registerModule(app, module);

    this._logger.debug(`Application created.`);

    let server: Server | undefined;
    return {
      start: (onStart, onError) => {
        server = app
          .listen(this._config.server.port, this._config.server.host, () => {
            this._logger.info(`Server running on ${cyan(this._baseUrl)}.`);
            onStart?.();
          })
          .on('error', (error) => {
            this._logger.error('Server error:', error);
            onError?.(error);
          });
      },

      stop: () => {
        if (!server) {
          throw new ServerError('Server not initialized.');
        }

        server.close();
        this._logger.info('Server stopped.');
      },
    };
  }

  private _registerMiddlewares(app: Express.Express) {
    app.use(Helmet());
    app.use(Express.json());
    app.use(Express.urlencoded({ extended: true }));
    app.use(Compression());
  }

  private async _registerModule<M extends object>(app: Express.Express, module: AppModule<M>) {
    const moduleName = (typeof module === 'function' ? module.name : module.token).toString();

    const moduleMetadata = MetadataFactory.create<ModuleMetadata>('module', typeof module === 'function' ? module : module.module);
    if (!moduleMetadata) {
      throw new DefinitionError(`Class ${moduleName} not decorated with @Module.`);
    }

    if (AppContainer.isModuleResolved(module)) {
      return;
    }

    this._logger.debug(`Registering module ${cyan(moduleName)}.`);

    const moduleInstance = await AppContainer.resolveModule(module);
    this._defineModuleInstanceMetadata(moduleInstance);

    const modules = moduleMetadata.get('modules') ?? [];
    for (const module of modules) {
      await this._registerModule(app, module);
    }

    const controllers = moduleMetadata.get('controllers') ?? [];
    controllers.forEach((controller) => {
      this._registerController(app, moduleInstance, controller);
    });
  }

  private _registerController<M extends object, C extends Class<object>>(app: Express.Express, moduleInstance: M, controller: C) {
    const controllerMetadata = MetadataFactory.create<ControllerMetadata>('controller', controller);
    if (!controllerMetadata) {
      throw new DefinitionError(`Class ${controller.name} not decorated with @Controller.`);
    }

    const moduleInstanceMetadata = MetadataFactory.create<ModuleInstanceMetadata>('module-instance', moduleInstance);
    if (!moduleInstanceMetadata) {
      throw new ReflectionError(`Module ${moduleInstance.constructor.name} instance metadata not found.`);
    }

    const moduleContainer = moduleInstanceMetadata?.get('container');
    if (!moduleContainer) {
      throw new ReflectionError(`Module ${moduleInstance.constructor.name} container not found.`);
    }

    this._logger.debug(`Registering controller ${cyan(controller.name)}.`);

    const controllerInstance = moduleContainer.resolve(controller);

    const controllerPath = controllerMetadata.get('path') || '/';
    const controllerActions = controllerMetadata.get('actions') ?? [];

    const router = Express.Router();
    controllerActions.forEach((propName) => {
      const propertyKey = propName as keyof typeof controllerInstance;

      const actionMetadata = MetadataFactory.create<ActionMetadata>('action', controllerInstance, propertyKey);
      if (typeof controllerInstance[propertyKey] !== 'function' || !actionMetadata) {
        return;
      }

      this._registerControllerAction(router, controllerInstance, controllerPath, actionMetadata, propertyKey);
    });

    app.use(controllerPath, router);
  }

  private _registerControllerAction<C extends object>(
    router: Express.Router,
    controllerInstance: C,
    controllerPath: string,
    actionMetadata: IMetadata<ActionMetadata>,
    propertyKey: string | symbol,
  ) {
    const actionMethod = actionMetadata.get('method') ?? HTTPMethod.Get;
    const actionPath = actionMetadata.get('path') || '/';
    const url = `${this._baseUrl}${StringUtil.resolvePath(controllerPath, actionPath)}`;

    this._logger.debug(`${' '.repeat(8 - actionMethod.length)}${actionMethod.toUpperCase()} ${cyan(url)} ${gray('->')} ${green(propertyKey.toString())}`);

    const action = controllerInstance[propertyKey as keyof typeof controllerInstance];
    if (typeof action !== 'function') {
      throw new DefinitionError(`Method ${propertyKey.toString()} not a function.`);
    }

    router[actionMethod](actionPath, async (request, response, next) => {
      this._logger.info(`Request ${cyan(request.method)} ${cyan(request.url)}.`);

      const params = [];
      const logParams = [];

      const actionParams = actionMetadata.get('parameters') ?? {};

      if (actionParams.request) {
        params[actionParams.request.index] = request;
        logParams[actionParams.request.index] = '[object ActionRequest]';
      }

      if (actionParams.response) {
        params[actionParams.response.index] = response;
        logParams[actionParams.response.index] = '[object ActionResponse]';
      }

      if (actionParams.next) {
        params[actionParams.next.index] = next;
        logParams[actionParams.next.index] = '[function NextFunction]';
      }

      if (actionParams.body) {
        params[actionParams.body.index] = request.body;
        logParams[actionParams.body.index] = request.body;
      }

      if (actionParams.params) {
        Object.entries(actionParams.params).forEach(([name, param]) => {
          if (!param) {
            return;
          }

          params[param.index] = request.params[name];
          logParams[param.index] = request.params[name];
        });
      }

      try {
        this._logger.debug(`Invoking action ${green(propertyKey.toString())} with parameters:`, logParams);
        const result = await Promise.resolve(action.bind(controllerInstance)(...(params as Parameters<RequestHandler>)));

        if (!result) {
          this._logger.info(`Action ${green(propertyKey.toString())} resolved with no result.`);
          return next();
        }

        if (!(result instanceof ActionResult)) {
          return next(new ServerError('Invalid action result.'));
        }

        this._logger.debug(`Action ${green(propertyKey.toString())} result:`, result);
        return result.resolve(request, response, () => {
          this._logger.info(`Action ${green(propertyKey.toString())} resolved with response status ${cyan(result.status.toString())}.`);
          return next();
        });
      } catch (error) {
        this._logger.error(`Action ${green(propertyKey.toString())} error:`, error);
        if (this._config.isProduction) {
          response.sendStatus(HTTPStatusCode.InternalServerError);
          return;
        } else {
          return next(error);
        }
      }
    });
  }

  private _defineModuleInstanceMetadata<M extends object>(moduleInstance: M) {
    const moduleInstanceMetadata = MetadataFactory.create<ModuleInstanceMetadata>(moduleInstance);

    moduleInstanceMetadata.define({
      $kind: 'module-instance',
      container: AppContainer.createModuleContainer(),
    });
  }

  private get _baseUrl(): string {
    return `http://${this._config.server.host}:${this._config.server.port}`;
  }
}

/** Application Factory. */
export const AppFactory: IAppFactory = new AppFactoryStatic();
