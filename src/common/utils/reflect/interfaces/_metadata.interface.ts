import type { Dictionary } from 'tsyringe/dist/typings/types';

import type { MetadataSchema } from '../types';

/**
 * Metadata interface.
 *
 * @template T Metadata type.
 */
export interface IMetadata<T extends MetadataSchema<string, Dictionary<unknown>>> {
  /**
   * Get metadata value by key.
   *
   * @param key Metadata key.
   *
   * @returns Metadata value.
   */
  get<K extends keyof T>(key: K): T[K] | undefined;

  /**
   * Set metadata value by key.
   *
   * @param key Metadata key.
   * @param value Metadata value.
   */
  set<K extends keyof T>(key: K, value: T[K]): void;

  /**
   * Check if metadata has key.
   *
   * @param key Metadata key.
   *
   * @returns True if metadata has key, false otherwise.
   */
  has(key: string): boolean;

  /**
   * Define metadata.
   *
   * @param metadata Metadata.
   */
  define(metadata: T): void;
}

/** Metadata factory interface. */
export interface IMetadataFactory {
  /**
   * Create metadata.
   *
   * @template T Metadata schema.
   * @param target Target object.
   * @param propertyKey Property key.
   *
   * @returns Metadata.
   */
  create<T extends MetadataSchema<string, Dictionary<unknown>>>(target: object, propertyKey?: string | symbol): IMetadata<T>;

  /**
   * Create metadata with strict kind.
   *
   * @template T Metadata schema.
   * @param kind Metadata kind.
   * @param target Target object.
   * @param propertyKey Property key.
   *
   * @returns Metadata.
   */
  create<T extends MetadataSchema<string, Dictionary<unknown>>>(kind: T['$kind'], target: object, propertyKey?: string | symbol): IMetadata<T> | null;
}
