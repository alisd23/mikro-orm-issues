import { Entity, Property } from '@mikro-orm/core';

import { Person } from './person.entity';

@Entity()
export class Employee extends Person {
  @Property()
  number: number;
}
