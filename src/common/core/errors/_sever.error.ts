/** Server Error. */
export class ServerError extends Error {
  constructor(message: string, cause?: unknown) {
    super(message);

    this.name = 'ServerError';
    this.cause = cause;
  }
}
