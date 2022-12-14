import { Entity, OneToOne, PrimaryKey } from "@mikro-orm/core";
import { Car } from "./Car.entity";

@Entity()
export class Person {
  @PrimaryKey()
  public id: number;

  @OneToOne(() => Car, car => car.person, { nullable: true })
  public car: Car | null;
}
