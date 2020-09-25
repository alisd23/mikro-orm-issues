import { Entity, PrimaryKey } from '@mikro-orm/core';

@Entity({
  discriminatorColumn: 'type',
  discriminatorMap: {
    person: 'Person', // Uncomment this line
    employee: 'Employee',
  },
})
export class Person {
  @PrimaryKey()
  id: string;
}
