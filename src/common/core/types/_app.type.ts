import type { Class } from 'type-fest';

/** Server Config. */
export type ServerConfig = {
  /** Hostname. */
  readonly host: string;

  /** Port. */
  readonly port: number;
};

/** Directory Config. */
export type DirectoryConfig = {
  /** Directory for logs. */
  readonly logs: string;
};

/** Application Start Handler. */
export type AppStartHandler = () => void;

/** Application Error Handler. */
export type AppErrorHandler = (error: Error) => void;

/**
 * Injection Module.
 *
 * @template T Module Type.
 */
export type InjectionModule<T extends object> = {
  /** Module Class. */
  module: Class<T>;

  /**
   * Module Register Handler.
   *
   * @param module Module instance.
   */
  onRegister?(module: T): void | Promise<void>;
};

/**
 * Application Module.
 *
 * @template T Module Type.
 */
export type AppModule<T extends object> = Class<T> | InjectionModule<T>;
