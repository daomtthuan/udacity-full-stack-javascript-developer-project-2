import type { EntityStatus } from '~constants/entity';

export abstract class Trackable {
  /** Date and time when the entity was created. */
  createdAt: Date;

  /** Date and time when the entity was last updated. */
  updatedAt: Date;

  /** ID of the user who created the entity. */
  createdBy: string;

  /** ID of the user who last updated the entity. */
  updatedBy: string;

  /** Status of the entity. */
  status: EntityStatus;

  constructor({ createdAt, updatedAt, createdBy, updatedBy, status }: Trackable) {
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.createdBy = createdBy;
    this.updatedBy = updatedBy;
    this.status = status;
  }
}
