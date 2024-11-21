import { Entity } from '~core';

import { Trackable } from './trackable';

/** User model. */
@Entity('users')
export class User extends Trackable {
  /** Unique identifier of the user. */
  id: string;

  /** Email of the user. */
  email: string;

  /** Password of the user. */
  password: string;

  /** First name of the user. */
  firstName: string;

  /** Last name of the user. */
  lastName: string;

  /** Role of the user. */
  role: string;

  constructor({ id, email, password, firstName, lastName, role, ...trackable }: User) {
    super(trackable);

    this.id = id;
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.role = role;
  }

  /** Get full name of the user. */
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  /** Get initials of the user. */
  get initials(): string {
    return `${this.firstName[0]}${this.lastName[0]}`;
  }
}
