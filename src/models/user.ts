import { Entity, Property } from '~core';

import type { ITrackableProps } from './trackable';

import { Trackable } from './trackable';

/** User properties. */
export interface IUserProps {
  /** Unique identifier of the user. */
  id: string;

  /** Username of the user. */
  username: string;

  /** Password of the user. */
  password: string;

  /** Full name of the user. */
  name: string;

  /** Email of the user. */
  email: string;

  /** Avatar url of the user. */
  avatarUrl: string;
}

/** User model. */
@Entity('users')
export class User extends Trackable implements IUserProps {
  @Property('id')
  id: string;

  @Property('username')
  username: string;

  @Property('password')
  password: string;

  @Property('name')
  name: string;

  @Property('email')
  email: string;

  @Property('avatar_url')
  avatarUrl: string;

  constructor({ id, username, password, name, email, avatarUrl }: IUserProps, trackable: ITrackableProps) {
    super(trackable);

    this.id = id;
    this.username = username;
    this.password = password;
    this.name = name;
    this.email = email;
    this.avatarUrl = avatarUrl;
  }
}
