/** Definition Error. */
export class DefinitionError extends Error {
  constructor(message: string, cause?: unknown) {
    super(message);

    this.name = 'DefinitionError';
    this.cause = cause;
  }
}
