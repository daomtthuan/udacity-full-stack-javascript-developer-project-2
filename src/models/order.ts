import type { OrderStage } from '~constants/entity';

import { Entity, Property } from '~core';

import type { ITrackableProps } from './trackable';

import { Trackable } from './trackable';

/** Order properties. */
export interface IOrderProps {
  /** Unique identifier of the order. */
  id: string;

  /** User ID who placed the order. */
  userId: string;

  /** Order stage (created, pending, confirmed, etc.). */
  stage: OrderStage;
}

/** Order model. */
@Entity('orders')
export class Order extends Trackable implements IOrderProps {
  @Property('id')
  id: string;

  @Property('user_id')
  userId: string;

  @Property('stage')
  stage: OrderStage;

  constructor({ id, userId, stage }: IOrderProps, trackable: ITrackableProps) {
    super(trackable);

    this.id = id;
    this.userId = userId;
    this.stage = stage;
  }
}
