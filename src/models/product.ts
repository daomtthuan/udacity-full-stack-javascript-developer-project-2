import { Entity, Property } from '~core';

import type { ITrackableProps } from './trackable';

import { Trackable } from './trackable';

/** Product properties. */
export interface IProductProps {
  /** Unique identifier of the product. */
  id: string;

  /** Name of the product. */
  name: string;

  /** Description of the product. */
  description: string;

  /** Price of the product. */
  price: number;
}

/** Product model. */
@Entity('products')
export class Product extends Trackable implements IProductProps {
  @Property('id')
  id: string;

  @Property('name')
  name: string;

  @Property('description')
  description: string;

  @Property('price')
  price: number;

  constructor({ id, name, description, price }: IProductProps, trackable: ITrackableProps) {
    super(trackable);

    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
  }
}
