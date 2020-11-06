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
  abstract: true,
})
export abstract class Vehicle {
  @PrimaryKey()
  id!: number;

  @Enum()
  type!: 'car' | 'bicycle';

  @OneToMany(
    () => Driver,
    driver => driver.vehicle,
  )
  drivers = new Collection<Driver>(this);
}

@Entity({ discriminatorValue: 'car' })
export class Car extends Vehicle {
  constructor(engine: string) {
    super();
    this.type = 'car';
    this.engine = engine;
  }

  @Property()
  public engine: string;
}

@Entity({ discriminatorValue: 'bicycle' })
export class Bicycle extends Vehicle {
  constructor(noOfGears: number) {
    super();
    this.type = 'bicycle';
    this.noOfGears = noOfGears;
  }

  @Property()
  public noOfGears: number;
}

@Entity()
export class Driver {
  constructor(name: string, person: Vehicle) {
    this.name = name;
    this.vehicle = person;
  }

  @PrimaryKey()
  id: number;

  @Property()
  name: string;

  @ManyToOne(() => Vehicle)
  vehicle: Vehicle;
}
