/** String Utility interface. */
export interface IStringUtil {
  /**
   * Resolve path.
   *
   * @param paths Paths to resolve.
   *
   * @returns Resolved path.
   */
  resolvePath(...paths: (string | undefined)[]): string;
}
