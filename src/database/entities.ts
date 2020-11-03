import {
  Collection,
  Entity,
  Enum,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';

@Entity({
  discriminatorColumn: 'type',
  discriminatorMap: { person: 'Person', employee: 'Employee' },
})
export abstract class BasePerson {
  @PrimaryKey()
  id!: number;

  @Enum()
  type!: 'employee' | 'manager';

  @OneToMany(
    () => Address,
    address => address.person,
  )
  addresses = new Collection<Address>(this);
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

@Entity()
export class Address {
  constructor(line1: string, person: BasePerson) {
    this.line1 = line1;
    this.person = person;
  }

  @PrimaryKey()
  id: number;

  @Property()
  line1: string;

  @ManyToOne(() => BasePerson)
  person: BasePerson;
}
