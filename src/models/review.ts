import { Entity, Property } from '~core';

import type { ITrackableProps } from './trackable';

import { Trackable } from './trackable';

/** Review properties. */
export interface IReviewProps {
  /** Unique identifier of the review. */
  id: string;

  /** ID of the user who wrote the review. */
  userId: string;

  /** ID of the product being reviewed. */
  productId: string;

  /** Rating given to the product. */
  rating: number;

  /** Comment about the product. */
  comment: string;
}

/** Review model. */
@Entity('reviews')
export class Review extends Trackable implements IReviewProps {
  @Property('id')
  id: string;

  @Property('user_id')
  userId: string;

  @Property('product_id')
  productId: string;

  @Property('rating')
  rating: number;

  @Property('comment')
  comment: string;

  constructor({ id, userId, productId, rating, comment }: IReviewProps, trackable: ITrackableProps) {
    super(trackable);

    this.id = id;
    this.userId = userId;
    this.productId = productId;
    this.rating = rating;
    this.comment = comment;
  }
}
