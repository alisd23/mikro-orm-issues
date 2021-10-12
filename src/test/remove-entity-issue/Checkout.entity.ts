import { Entity, OneToOne, PrimaryKey } from "@mikro-orm/core";

import { DiscountDeduction } from "./DiscountDeduction.entity";

@Entity()
export class Checkout {
  @PrimaryKey()
  id: number;

  @OneToOne(() => DiscountDeduction, deduction => deduction.checkout, {
    nullable: true,
    // owner: true,
  })
  public discountDeduction: DiscountDeduction | null;
}
