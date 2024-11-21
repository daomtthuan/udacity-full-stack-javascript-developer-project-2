import type { DependencyContainer, InjectionToken } from 'tsyringe';
import type { Class } from 'type-fest';

import { container } from 'tsyringe';

import type { IAppContainer } from '../interfaces';
import type { AppModule, InjectionModule } from '../types';

import { InterfaceToken } from '../constants';
import { AppConfig } from './_app-config';
import { AppLogger } from './_app-logger';

/** App Container Static. */
class AppContainerStatic implements IAppContainer {
  static readonly resolvedModules = new Map<InjectionToken<object>, object>();

  constructor(
    readonly isRoot: boolean,
    readonly parent: IAppContainer | undefined,
    readonly container: DependencyContainer,
  ) {
    if (this.isRoot) {
      this._registerDependency();
    }
  }

  resolve<T>(token: InjectionToken<T>): T {
    return this.container.resolve(token);
  }

  async resolveModule<M extends object>(module: AppModule<M>): Promise<M> {
    if (typeof module === 'function') {
      return this._resolveClassModule(module);
    }

    return await this._resolveInjectionModule(module);
  }

  isModuleResolved<M extends object>(token: AppModule<M>): boolean {
    if (typeof token === 'function') {
      return AppContainerStatic.resolvedModules.has(token);
    }

    return AppContainerStatic.resolvedModules.has(token.token);
  }

  createModuleContainer() {
    return new AppContainerStatic(false, this, this.container.createChildContainer());
  }

  private _resolveClassModule<M extends object>(module: Class<M>): M {
    this.container.registerSingleton(module);
    const instance = this.container.resolve(module);

    AppContainerStatic.resolvedModules.set(module, instance);

    return instance;
  }

  private async _resolveInjectionModule<M extends object>(module: InjectionModule<M>): Promise<M> {
    this.container.registerSingleton(module.token, module.module);
    const instance = this.container.resolve(module.token);

    AppContainerStatic.resolvedModules.set(module.token, instance);

    if ('onResolved' in module && module.onResolved) {
      await Promise.resolve(module.onResolved(instance));
    }

    return instance;
  }

  private _registerDependency() {
    this.container.registerSingleton(InterfaceToken.IAppConfig, AppConfig);
    this.container.registerSingleton(InterfaceToken.IAppLogger, AppLogger);
  }
}

/** App Container. */
export const AppContainer: IAppContainer = new AppContainerStatic(true, undefined, container);
