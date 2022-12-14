import { Entity, OneToOne, PrimaryKey } from "@mikro-orm/core";
import { Person } from "./Person.entity";

@Entity()
export class Car {
  @PrimaryKey()
  public id: number;

  @OneToOne(() => Person, person => person.car, {
    nullable: true,
    owner: true,
  })
  public person: Person | null;
}
