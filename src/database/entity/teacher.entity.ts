import { Entity, Property } from '@mikro-orm/core';
import { Person } from './person.entity';

@Entity({
  discriminatorValue: 'teacher',
})
export class Teacher extends Person {
  @Property()
  subject: string;
}
