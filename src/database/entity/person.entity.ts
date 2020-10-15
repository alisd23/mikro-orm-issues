import { Entity, Enum, PrimaryKey } from '@mikro-orm/core';

@Entity({
  discriminatorColumn: 'type',
})
export abstract class Person {
  @PrimaryKey()
  id: string;

  @Enum()
  type!: 'gardener' | 'teacher' | 'chef';
}
