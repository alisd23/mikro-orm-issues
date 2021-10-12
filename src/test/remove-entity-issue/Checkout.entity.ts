import { Entity, OneToOne, PrimaryKey } from "@mikro-orm/core";

import { DiscountDeduction } from "./DiscountDeduction.entity";

@Entity()
export class Checkout {
  @PrimaryKey()
  id: number;

  @OneToOne(() => DiscountDeduction, deduction => deduction.checkout, {
    nullable: true,
    /**
     * @NOTE if owner is set on the `DiscountDeduction` side, the tests fail
     */
    owner: true
  })
  public discountDeduction: DiscountDeduction | null;
}
