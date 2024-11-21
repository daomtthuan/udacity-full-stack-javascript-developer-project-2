import type { Dictionary } from 'tsyringe/dist/typings/types';

import type { IMetadata, IMetadataFactory } from './interfaces';
import type { MetadataSchema } from './types';

/** Metadata Factory Static. */
class MetadataFactoryStatic implements IMetadataFactory {
  create<T extends MetadataSchema<string, Dictionary<unknown>>>(target: object, propertyKey?: string | symbol): IMetadata<T>;
  create<T extends MetadataSchema<string, Dictionary<unknown>>>(kind: T['$kind'], target: object, propertyKey?: string | symbol): IMetadata<T> | null;
  create<T extends MetadataSchema<string, Dictionary<unknown>>>(
    arg1: object | T['$kind'],
    arg2?: string | symbol | object,
    arg3?: string | symbol,
  ): IMetadata<T> | null {
    // create<T extends MetadataSchema<string, Dictionary<unknown>>>(target: object, propertyKey?: string | symbol): IMetadata<T>;
    if (typeof arg1 === 'object' || typeof arg1 === 'function') {
      const target = arg1 as object;
      const propertyKey = arg2 as string | symbol | undefined;

      if (typeof propertyKey === 'string' || typeof propertyKey === 'symbol') {
        return this._createProperty(target, propertyKey);
      }

      return this._createClass(target);
    }

    // create<T extends MetadataSchema<string, Dictionary<unknown>>>(kind: T['$kind'], target: object, propertyKey?: string | symbol): IMetadata<T> | null;
    const kind = arg1 as T['$kind'];
    const target = arg2 as object;
    const propertyKey = arg3 as string | symbol | undefined;

    let metadata: IMetadata<T>;
    if (typeof propertyKey === 'string' || typeof propertyKey === 'symbol') {
      metadata = this._createProperty(target, propertyKey);
    } else {
      metadata = this._createClass(target);
    }

    if (metadata.has('$kind') && metadata.get('$kind') === kind) {
      return metadata;
    }

    return null;
  }

  private _createClass<T extends MetadataSchema<string, Dictionary<unknown>>>(target: object): IMetadata<T> {
    return {
      get: (key) => Reflect.getMetadata(key, target),

      set: (key, value) => Reflect.defineMetadata(key, value, target),

      has: (key) => Reflect.hasMetadata(key, target),

      define: (metadata) =>
        Object.entries(metadata).forEach(([key, value]) => {
          Reflect.defineMetadata(key, value, target);
        }),
    };
  }

  private _createProperty<T extends MetadataSchema<string, Dictionary<unknown>>>(target: object, propertyKey: string | symbol): IMetadata<T> {
    return {
      get: (key) => Reflect.getMetadata(key, target.constructor, propertyKey),

      set: (key, value) => Reflect.defineMetadata(key, value, target.constructor, propertyKey),

      has: (key) => Reflect.hasMetadata(key, target.constructor, propertyKey),

      define: (metadata) =>
        Object.entries(metadata).forEach(([key, value]) => {
          Reflect.defineMetadata(key, value, target.constructor, propertyKey);
        }),
    };
  }
}

/** Metadata Factory. */
export const MetadataFactory: IMetadataFactory = new MetadataFactoryStatic();
