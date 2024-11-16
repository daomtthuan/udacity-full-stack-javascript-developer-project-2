import type { ReflectAble } from '~utils/reflect/types';

/** Reflect Utility Static. */
export class ReflectUtilStatic {
  /**
   *
   *
   * @template T ReflectAble Object type.
   * @param obj Object to check.
   * @param kind Kind of the object.
   *
   * @returns Returns whether the object is the specified ReflectAble type.
   */
  isType<T extends ReflectAble<string, object>>(obj: unknown, kind: T['$kind']): obj is T {
    return typeof obj === 'object' && !!obj && '$kind' in obj && obj.$kind === kind;
  }
}

/** Reflect Utility. */
export const ReflectUtil = new ReflectUtilStatic();
