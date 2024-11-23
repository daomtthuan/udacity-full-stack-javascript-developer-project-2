import { Entity, Property } from '~core';

import { Trackable } from './trackable';

/** User model. */
@Entity('users')
export class User extends Trackable {
  /** Unique identifier of the user. */
  @Property('id')
  id: string;

  /** Username of the user. */
  @Property('username')
  username: string;

  /** Password of the user. */
  @Property('password')
  password: string;

  /** Full name of the user. */
  @Property('name')
  name: string;

  /** Email of the user. */
  @Property('email')
  email: string;

  /** Avatar url of the user. */
  @Property('avatar_url')
  avatarUrl: string;

  constructor({ id, username, password, name, email, avatarUrl, ...trackable }: User) {
    super(trackable);

    this.id = id;
    this.username = username;
    this.password = password;
    this.name = name;
    this.email = email;
    this.avatarUrl = avatarUrl;
  }
}
