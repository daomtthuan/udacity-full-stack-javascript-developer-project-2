import { Entity, Property } from '~core';

import { Trackable } from './trackable';

/** Review model. */
@Entity('reviews')
export class Review extends Trackable {
  /** Unique identifier of the review. */
  @Property('id')
  id!: string;

  /** ID of the user who wrote the review. */
  @Property('user_id')
  userId!: string;

  /** ID of the product being reviewed. */
  @Property('product_id')
  productId!: string;

  /** Rating given to the product. */
  @Property('rating')
  rating!: number;

  /** Comment about the product. */
  @Property('comment')
  comment!: string;
}
