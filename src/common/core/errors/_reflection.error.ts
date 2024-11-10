/** Reflection Error. */
export class ReflectionError extends Error {
  constructor(message: string, cause?: unknown) {
    super(message);

    this.name = 'ReflectionError';
    this.cause = cause;
  }
}
