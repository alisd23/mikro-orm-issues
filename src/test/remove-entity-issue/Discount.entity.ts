import { Entity, OneToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Checkout } from "./Checkout.entity";

@Entity()
export class Discount {
  constructor(amount: number) {
    this.amount = amount;
  }

  @PrimaryKey()
  public id: number;

  @OneToOne(() => Checkout, checkout => checkout.discount, {
    nullable: true,
    /**
     * @NOTE if owner is set on the `Checkout` side, the tests pass fine
     */
    owner: true
  })
  public checkout: Checkout | null;

  @Property()
  public amount: number;
}
