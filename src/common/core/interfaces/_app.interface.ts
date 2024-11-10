import type { InjectionToken } from 'tsyringe';
import type { Class } from 'type-fest';

import type { AppErrorHandler, AppStartHandler, DirectoryConfig, ServerConfig } from '../types';

/** Application Container interface. */
export interface IAppContainer {
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
   * Resolve a module into an instance.
   *
   * @template M Module type.
   * @param token The dependency token.
   *
   * @returns An instance of the module.
   */
  resolveModule<M extends IModule>(token: Class<M>): M;

  /**
   * Check if module is resolved.
   *
   * @template M Module type.
   * @param token The dependency token.
   *
   * @returns True if module is resolved, false otherwise.
   */
  isModuleResolved<M extends IModule>(token: Class<M>): boolean;

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
  create<M extends Class<IModule>>(Module: M): IApp;
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

/** Module interface. */
export interface IModule {}

/** Provider interface. */
export interface IProvider {}

/** Controller interface. */
export interface IController {}
