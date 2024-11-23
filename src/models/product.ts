import { Entity, Property } from '~core';

import { Trackable } from './trackable';

/** Product model. */
@Entity('products')
export class Product extends Trackable {
  /** Unique identifier of the product. */
  @Property('id')
  id: string;

  /** Name of the product. */
  @Property('name')
  name: string;

  /** Description of the product. */
  @Property('description')
  description: string;

  /** Price of the product. */
  @Property('price')
  price: number;

  constructor({ id, name, description, price, ...trackable }: Product) {
    super(trackable);

    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
  }
}
