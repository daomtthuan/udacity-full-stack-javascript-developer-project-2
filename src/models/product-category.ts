import { Entity, Property } from '~core';

import type { ITrackableProps } from './trackable';

import { Trackable } from './trackable';

/** ProductCategory properties. */
export interface IProductCategory {
  /** Unique identifier of the product-category relation. */
  productId: string;

  /** Unique identifier of the category. */
  categoryId: string;
}

/** ProductCategory model. */
@Entity('product_categories')
export class ProductCategory extends Trackable implements IProductCategory {
  @Property('product_id')
  productId: string;

  @Property('category_id')
  categoryId: string;

  constructor({ productId, categoryId }: IProductCategory, trackable: ITrackableProps) {
    super(trackable);

    this.productId = productId;
    this.categoryId = categoryId;
  }
}
