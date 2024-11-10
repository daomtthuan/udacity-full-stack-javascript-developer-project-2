/** Configuration Error. */
export class ConfigurationError extends Error {
  constructor(message: string, cause?: unknown) {
    super(message);

    this.name = 'ConfigurationError';
    this.cause = cause;
  }
}
