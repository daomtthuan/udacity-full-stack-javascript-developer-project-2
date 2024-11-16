/** String Utility Static. */
export class StringUtilStatic {
  /**
   * Resolve path.
   *
   * @param paths Paths to resolve.
   *
   * @returns Resolved path.
   */
  resolvePath(...paths: (string | undefined)[]): string {
    let resolvedPath = paths
      .filter((path): path is string => !!path)
      .map((path) => path?.replace(/\\/g, '/'))
      .join('/')
      .replace(/\/{2,}/g, '/');

    resolvedPath = resolvedPath.startsWith('/') ? resolvedPath : `/${resolvedPath}`;
    resolvedPath = resolvedPath.endsWith('/') ? resolvedPath.slice(0, -1) : resolvedPath;

    return resolvedPath;
  }
}

/** String Utility. */
export const StringUtil = new StringUtilStatic();
