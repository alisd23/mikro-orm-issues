import { Entity, OneToOne, PrimaryKey } from "@mikro-orm/core";

import { Discount } from "./Discount.entity";

@Entity()
export class Checkout {
  @PrimaryKey()
  public id: number;

  @OneToOne(() => Discount, discount => discount.checkout, {
    nullable: true,
    // owner: true,
  })
  public discount: Discount | null;
}
