import { Entity, Enum, PrimaryKey } from '@mikro-orm/core';

@Entity({
  discriminatorColumn: 'type',
  discriminatorMap: { person: 'Person', employee: 'Employee' },
})
export abstract class BasePerson {
  @PrimaryKey()
  id: number;

  @Enum()
  type!: 'employee' | 'manager';
}

@Entity()
export class Employee extends BasePerson {
  constructor() {
    super();
    this.type = 'employee';
  }
}

@Entity()
export class Manager extends BasePerson {
  constructor() {
    super();
    this.type = 'manager';
  }
}
