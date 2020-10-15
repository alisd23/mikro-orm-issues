import { Entity, Property } from '@mikro-orm/core';
import { Person } from './person.entity';

@Entity({
  discriminatorValue: 'chef',
})
export class Chef extends Person {
  @Property()
  kitchen: string;
}
