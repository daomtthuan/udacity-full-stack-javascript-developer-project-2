import { Entity, Property } from '~core';

import { Trackable } from './trackable';

/** Category model. */
@Entity('categories')
export class Category extends Trackable {
  /** Unique identifier of the category. */
  @Property('id')
  id!: string;

  /** Name of the category. */
  @Property('name')
  name!: string;

  /** Description of the category. */
  @Property('description')
  description!: string;
}
