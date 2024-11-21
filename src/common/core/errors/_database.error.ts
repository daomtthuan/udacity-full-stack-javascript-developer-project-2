/** Database Error. */
export class DatabaseError extends Error {
  constructor(message: string, cause?: unknown) {
    super(message);

    this.name = 'DatabaseError';
    this.cause = cause;
  }

  /**
   * Error cause.
   *
   * @param error Cause.
   *
   * @returns Database error.
   */
  static fromError(error: unknown): DatabaseError {
    return new DatabaseError(error instanceof Error ? error.message : String(error), error);
  }
}
