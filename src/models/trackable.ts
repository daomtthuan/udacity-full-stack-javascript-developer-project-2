import type { EntityStatus } from '~constants/entity';

import { Property } from '~core';

export class Trackable {
  /** Status of the entity (active, inactive, etc.). */
  @Property('status')
  status!: EntityStatus;

  /** ID of the user who created the entity. */
  @Property('created_by_user_id')
  createdByUserId?: string | undefined;

  /** Date and time when the entity was created. */
  @Property('created_at')
  createdAt?: Date | undefined;

  /** Date and time when the entity was last updated. */
  @Property('updated_by_user_id')
  updatedByUserId?: string | undefined;

  /** ID of the user who last updated the entity. */
  @Property('updated_at')
  updatedAt?: Date | undefined;
}
