import type { DependencyContainer, InjectionToken } from 'tsyringe';
import type { Class } from 'type-fest';

import { container } from 'tsyringe';

import { MetadataFactory } from '~utils/reflect';

import type { IAppContainer } from '../interfaces';
import type { AppModule, ProviderMetadata } from '../types';

import { CoreToken, ProviderScope } from '../constants';
import { DefinitionError } from '../errors';
import { ModuleMetadata } from '../types';
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

  registerProvider<P extends object>(provider: Class<P>) {
    const providerMetadata = MetadataFactory.create<ProviderMetadata>('provider', provider);
    if (!providerMetadata) {
      throw new DefinitionError(`Class '${provider.name}' not decorated with '@Provider'.`);
    }

    const token = providerMetadata.get('token') ?? provider;
    const scope = providerMetadata.get('scope') ?? ProviderScope.Default;

    if (scope === ProviderScope.Default) {
      this.container.registerSingleton(token, provider);
    } else {
      this.container.register(token, provider);
    }
  }

  async registerModule<M extends object>(module: AppModule<M>) {
    const moduleClass = typeof module === 'function' ? module : module.module;
    const moduleMetadata = MetadataFactory.create<ModuleMetadata>('module', moduleClass);
    if (!moduleMetadata) {
      throw new DefinitionError(`Class '${moduleClass.name}' not decorated with '@Module'.`);
    }

    const moduleToken = moduleMetadata.get('token') ?? moduleClass;
    this.container.registerSingleton(moduleToken, moduleClass);

    const instance = this.container.resolve(moduleToken);
    AppContainerStatic.resolvedModules.set(moduleToken, instance);

    if (typeof module !== 'function') {
      await Promise.resolve(module?.onRegister?.(instance));
    }

    return instance;
  }

  isModuleRegistered<M extends object>(module: AppModule<M>): boolean {
    const moduleClass = typeof module === 'function' ? module : module.module;
    const moduleMetadata = MetadataFactory.create<ModuleMetadata>('module', moduleClass);
    if (!moduleMetadata) {
      throw new DefinitionError(`Class '${moduleClass.name}' not decorated with '@Module'.`);
    }

    const moduleToken = moduleMetadata.get('token') ?? moduleClass;
    return AppContainerStatic.resolvedModules.has(moduleToken);
  }

  resolve<T>(token: InjectionToken<T>): T {
    return this.container.resolve(token);
  }

  createModuleContainer() {
    return new AppContainerStatic(false, this, this.container.createChildContainer());
  }

  private _registerDependency() {
    this.container.registerSingleton(CoreToken.IAppConfig, AppConfig);
    this.container.registerSingleton(CoreToken.IAppLogger, AppLogger);
  }
}

/** App Container. */
export const AppContainer: IAppContainer = new AppContainerStatic(true, undefined, container);
