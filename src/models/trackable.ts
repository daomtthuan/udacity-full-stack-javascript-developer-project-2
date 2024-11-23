import type { EntityStatus } from '~constants/entity';

import { Property } from '~core';

export abstract class Trackable {
  /** Status of the entity (active, inactive, etc.). */
  @Property('status')
  status: EntityStatus;

  /** Date and time when the entity was created. */
  @Property('created_at')
  createdAt: Date;

  /** ID of the user who created the entity. */
  @Property('created_by')
  createdBy: string;

  /** Date and time when the entity was last updated. */
  @Property('updated_at')
  updatedAt: Date;

  /** ID of the user who last updated the entity. */
  @Property('updated_by')
  updatedBy: string;

  constructor({ createdAt, updatedAt, createdBy, updatedBy, status }: Trackable) {
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.createdBy = createdBy;
    this.updatedBy = updatedBy;
    this.status = status;
  }
}
