import type { Server } from 'http';
import type { Class } from 'type-fest';

import { cyan, gray, green } from 'ansis';
import Compression from 'compression';
import Express, { type RequestHandler } from 'express';
import Helmet from 'helmet';

import type { IMetadata } from '~utils/reflect';

import { StringUtil } from '~utils/data';
import { MetadataFactory } from '~utils/reflect';

import type { IApp, IAppConfig, IAppContainer, IAppFactory, IAppLogger } from '../interfaces';
import type { AppModule, ProviderMetadata } from '../types';

import { CoreToken, HTTPMethod, HTTPStatusCode } from '../constants';
import { DefinitionError, ServerError } from '../errors';
import { ActionResult } from '../http';
import { ActionMetadata, ControllerMetadata, ModuleMetadata } from '../types';
import { AppContainer } from './_app-container';
import { AppEnv } from './_app-env';

/** Application Factory Static. */
class AppFactoryStatic implements IAppFactory {
  private readonly _config: IAppConfig;
  private readonly _logger: IAppLogger;

  constructor() {
    this._config = AppContainer.resolve<IAppConfig>(CoreToken.IAppConfig);
    this._logger = AppContainer.resolve<IAppLogger>(CoreToken.IAppLogger).createLogger('AppFactory');

    this._logger.debug('Initialized.');
  }

  async create<M extends Class<object>>(moduleClass: M): Promise<IApp> {
    this._logger.info(`Application create with mode: ${cyan(AppEnv.mode ?? 'default')}, isProduction: ${cyan(this._config.isProduction ? 'true' : 'false')}.`);

    const app = Express();
    this._registerMiddlewares(app);
    await this._registerModule(app, AppContainer, moduleClass);

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

  private async _registerModule<M extends object>(app: Express.Express, container: IAppContainer, module: AppModule<M>) {
    const moduleClass = typeof module === 'function' ? module : module.module;
    const moduleMetadata = MetadataFactory.create<ModuleMetadata>('module', moduleClass);
    if (!moduleMetadata) {
      throw new DefinitionError(`Class ${moduleClass.name} not decorated with @Module.`);
    }

    if (container.isModuleRegistered(module)) {
      return;
    }

    const moduleName = moduleMetadata.get('token')?.toString() ?? moduleClass.name;
    this._logger.debug(`Registering module ${cyan(moduleName)}.`);

    await container.registerModule(module);
    const moduleContainer = container.createModuleContainer();

    const providers = moduleMetadata.get('providers') ?? [];
    providers.forEach((provider) => {
      this._registerProvider(moduleContainer, provider);
    });

    const controllers = moduleMetadata.get('controllers') ?? [];
    controllers.forEach((controller) => {
      this._registerController(app, moduleContainer, controller);
    });

    const modules = moduleMetadata.get('modules') ?? [];
    for (const module of modules) {
      await this._registerModule(app, moduleContainer, module);
    }
  }

  private _registerController<C extends Class<object>>(app: Express.Express, container: IAppContainer, controllerClass: C) {
    const controllerMetadata = MetadataFactory.create<ControllerMetadata>('controller', controllerClass);
    if (!controllerMetadata) {
      throw new DefinitionError(`Class ${controllerClass.name} not decorated with @Controller.`);
    }

    this._logger.debug(`Registering controller ${cyan(controllerClass.name)}.`);

    const controllerInstance = container.resolve(controllerClass);

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

  private _registerProvider<P extends object>(container: IAppContainer, providerClass: Class<P>) {
    const providerMetadata = MetadataFactory.create<ProviderMetadata>('provider', providerClass);
    if (!providerMetadata) {
      throw new DefinitionError(`Class ${providerClass.name} not decorated with @Provider.`);
    }

    container.registerProvider(providerClass);
  }

  private get _baseUrl(): string {
    return `http://${this._config.server.host}:${this._config.server.port}`;
  }
}

/** Application Factory. */
export const AppFactory: IAppFactory = new AppFactoryStatic();
