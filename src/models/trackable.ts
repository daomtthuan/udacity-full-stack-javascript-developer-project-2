import type { EntityStatus } from '~constants/entity';

import { ManyToOne, Property } from '~core';
import { User } from '~models/user';

/** Trackable properties. */
export interface ITrackableProps {
  /** Status of the entity (active, inactive, etc.). */
  status: EntityStatus;

  /** Date and time when the entity was created. */
  createdAt?: Date | undefined;

  /** ID of the user who created the entity. */
  createdByUserId?: string | undefined;

  /** Date and time when the entity was last updated. */
  updatedAt?: Date | undefined;

  /** ID of the user who last updated the entity. */
  updatedByUserId?: string | undefined;
}

export class Trackable implements ITrackableProps {
  @Property('status')
  status: EntityStatus;

  @Property('created_at')
  createdAt?: Date | undefined;

  @Property('created_by_user_id')
  createdByUserId?: string | undefined;

  @Property('updated_at')
  updatedAt?: Date | undefined;

  @Property('updated_by_user_id')
  updatedByUserId?: string | undefined;

  @ManyToOne(() => User, (user) => user.id)
  createdBy?: User | undefined;

  @ManyToOne(() => User, (user) => user.id)
  updatedBy?: User | undefined;

  constructor({ status, createdAt, createdByUserId, updatedAt, updatedByUserId }: ITrackableProps) {
    this.status = status;
    this.createdAt = createdAt;
    this.createdByUserId = createdByUserId;
    this.updatedAt = updatedAt;
    this.updatedByUserId = updatedByUserId;
  }
}
