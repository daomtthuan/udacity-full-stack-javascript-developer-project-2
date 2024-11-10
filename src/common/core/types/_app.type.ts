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
