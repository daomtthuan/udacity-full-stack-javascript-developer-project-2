import { Entity, Property } from '~core';

import type { ITrackableProps } from './trackable';

import { Trackable } from './trackable';

/** Category properties. */
export interface ICategoryProps {
  /** Unique identifier of the category. */
  id: string;

  /** Name of the category. */
  name: string;

  /** Description of the category. */
  description: string;
}

/** Category model. */
@Entity('categories')
export class Category extends Trackable implements ICategoryProps {
  @Property('id')
  id: string;

  @Property('name')
  name: string;

  @Property('description')
  description: string;

  constructor({ id, name, description }: ICategoryProps, trackable: ITrackableProps) {
    super(trackable);

    this.id = id;
    this.name = name;
    this.description = description;
  }
}
