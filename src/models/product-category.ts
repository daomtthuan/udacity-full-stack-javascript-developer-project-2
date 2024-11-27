import { Entity, Property } from '~core';

import { Trackable } from './trackable';

/** ProductCategory model. */
@Entity('product_categories')
export class ProductCategory extends Trackable {
  /** Unique identifier of the product-category relation. */
  @Property('product_id')
  productId!: string;

  /** Unique identifier of the category. */
  @Property('category_id')
  categoryId!: string;
}
