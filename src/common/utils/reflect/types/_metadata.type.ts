import type { Dictionary } from 'tsyringe/dist/typings/types';

/**
 * Reflect-able type.
 *
 * @template K Kind of the object.
 * @template T Object type.
 */
export type ReflectAble<K extends string, T extends object> = {
  /** Predicate that indicates whether the instance is the specified kind. */
  readonly $kind: K;
} & T;

/** Metadata schema. */
export type MetadataSchema<K extends string, T extends Dictionary<unknown>> = ReflectAble<K, T>;
