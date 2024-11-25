import type { DependencyContainer, InjectionToken } from 'tsyringe';
import type { Class } from 'type-fest';

import type { AppErrorHandler, AppModule, AppStartHandler, DirectoryConfig, ServerConfig } from '../types';

/** Application Environment interface. */
export interface IAppEnv {
  readonly mode: string | undefined;

  /**
   * Get a configuration value.
   *
   * @param key Configuration key.
   * @param defaultValue Default value.
   *
   * @returns Configuration value.
   */
  getString(key: string, defaultValue?: string): string;

  /**
   * Get a configuration value.
   *
   * @param key Configuration key.
   * @param defaultValue Default value.
   *
   * @returns Configuration value.
   */
  getNumber(key: string, defaultValue?: number): number;
}

/** Application Container interface. */
export interface IAppContainer {
  /** Indicates whether the container is root. */
  readonly isRoot: boolean;

  /** Parent container. */
  readonly parent: IAppContainer | undefined;

  /** Dependency container. */
  readonly container: DependencyContainer;

  /**
   * Register provider.
   *
   * @template P Provider type.
   * @param provider The provider.
   */
  registerProvider<P extends object>(provider: Class<P>): void;

  /**
   * Register module.
   *
   * @template M Module type.
   * @param module The module.
   */
  registerModule<M extends object>(module: AppModule<M>): Promise<void>;

  /**
   * Check if module is registered.
   *
   * @template M Module type.
   * @param module The module.
   *
   * @returns True if module is registered, false otherwise.
   */
  isModuleRegistered<M extends object>(module: AppModule<M>): boolean;

  /**
   * Resolve a token into an instance.
   *
   * @template T Instance type.
   * @param token The dependency token.
   *
   * @returns An instance of the dependency.
   */
  resolve<T>(token: InjectionToken<T>): T;

  /**
   * Create a child container for module.
   *
   * @returns Child container.
   */
  createModuleContainer(): IAppContainer;
}

/** Application Configuration interface. */
export interface IAppConfig {
  /** Indicates whether the application is running in production mode. */
  readonly isProduction: boolean;

  /** Server configuration. */
  readonly server: ServerConfig;

  /** Directory configuration. */
  readonly directory: DirectoryConfig;
}

/** Application interface. */
export interface IApp {
  /**
   * Start the application.
   *
   * @param onStart Start handler.
   * @param onError Error handler.
   */
  start(onStart?: AppStartHandler, onError?: AppErrorHandler): void;

  /** Stop the application. */
  stop(): void;
}

/** Application Factory interface. */
export interface IAppFactory {
  /**
   * Create an application.
   *
   * @template M Module type.
   * @param rootModule Root module of the application.
   *
   * @returns Application.
   */
  create<M extends Class<object>>(moduleClass: M): Promise<IApp>;
}

/** Application logger interface. */
export interface IAppLogger {
  /**
   * Log an error message.
   *
   * @param message Message.
   * @param meta Additional data.
   */
  error(message: string, ...meta: unknown[]): void;

  /**
   * Log a warning message.
   *
   * @param message Message.
   * @param meta Additional data.
   */
  warn(message: string, ...meta: unknown[]): void;

  /**
   * Log a info message.
   *
   * @param message Message.
   * @param meta Additional data.
   */
  info(message: string, ...meta: unknown[]): void;

  /**
   * Log a debug message.
   *
   * @param message Message.
   * @param meta Additional data.
   */
  debug(message: string, ...meta: unknown[]): void;

  /**
   * Create a child logger.
   *
   * @param label Label.
   *
   * @returns Child logger.
   */
  createLogger(label: string): IAppLogger;
}
