import type { OrderStage } from '~constants/entity';

import { Entity, Property } from '~core';

import { Trackable } from './trackable';

/** Order model. */
@Entity('orders')
export class Order extends Trackable {
  /** Unique identifier of the order. */
  @Property('id')
  id!: string;

  /** User ID who placed the order. */
  @Property('user_id')
  userId!: string;

  /** Order stage (created, pending, confirmed, etc.). */
  @Property('stage')
  stage!: OrderStage;
}
