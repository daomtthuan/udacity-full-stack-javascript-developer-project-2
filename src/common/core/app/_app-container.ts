import type { Class } from 'type-fest';

import { container, type InjectionToken } from 'tsyringe';

import type { IAppContainer, IModule } from '../interfaces';

import { AppToken } from '../constants';
import { AppConfig } from './_app-config';
import { AppLogger } from './_app-logger';

/** App Container Static. */
export class AppContainerStatic implements IAppContainer {
  private readonly _container = container.createChildContainer();
  private readonly _resolvedModules = new Map<InjectionToken<IModule>, IModule>();

  constructor(isRoot: boolean = false) {
    if (isRoot) {
      this._registerDependency();
    }
  }

  resolve<T>(token: InjectionToken<T>): T {
    return this._container.resolve(token);
  }

  resolveModule<M extends IModule>(token: Class<M>): M {
    const module = this._container.resolve(token);
    this._resolvedModules.set(token, module);

    return module;
  }

  isModuleResolved<M extends IModule>(token: Class<M>): boolean {
    return this._resolvedModules.has(token);
  }

  createModuleContainer() {
    return new AppContainerStatic(false);
  }

  private _registerDependency() {
    this._container.registerSingleton(AppToken.IAppConfig, AppConfig);
    this._container.registerSingleton(AppToken.IAppLogger, AppLogger);
  }
}

/** App Container. */
export const AppContainer: IAppContainer = new AppContainerStatic(true);
