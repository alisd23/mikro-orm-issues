import { Entity, Property } from '@mikro-orm/core';
import { Person } from './person.entity';

@Entity({
  discriminatorValue: 'gardener',
})
export class Gardener extends Person {
  @Property()
  plant: string;
}
