import type { IReflectUtil } from './interfaces/_reflect-util.interface';
import type { ReflectAble } from './types';

/** Reflect Utility Static. */
class ReflectUtilStatic implements IReflectUtil {
  isType<T extends ReflectAble<string, object>>(obj: unknown, kind: T['$kind']): obj is T {
    return typeof obj === 'object' && !!obj && '$kind' in obj && obj.$kind === kind;
  }
}

/** Reflect Utility. */
export const ReflectUtil: IReflectUtil = new ReflectUtilStatic();
