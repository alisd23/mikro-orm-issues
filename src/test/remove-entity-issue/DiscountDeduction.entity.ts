import { Entity, OneToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Checkout } from "./Checkout.entity";

@Entity()
export class DiscountDeduction {
  constructor(amount: number) {
    this.amount = amount;
  }

  @PrimaryKey()
  id: number;

  @OneToOne(() => Checkout, checkout => checkout.discountDeduction, {
    nullable: true,
  })
  public checkout: Checkout | null;

  @Property()
  amount: number;
}
