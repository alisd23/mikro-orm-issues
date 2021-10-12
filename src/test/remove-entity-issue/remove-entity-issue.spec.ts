import { AnyEntity, MikroORM } from "@mikro-orm/core";
import { EntityManager, MySqlDriver } from "@mikro-orm/mysql";

import config from "../../mikro-orm.config";
import { clearDatabase, migrateDatabase } from "../test-helpers";
import { Checkout } from "./Checkout.entity";
import { DiscountDeduction } from "./DiscountDeduction.entity";

describe("Remove entiy issue", () => {
  let orm: MikroORM<MySqlDriver>;
  let em: EntityManager;

  beforeAll(async () => {
    orm = await MikroORM.init({
      ...config,
      debug: false,
      entities: [DiscountDeduction, Checkout],
    });
    await migrateDatabase(orm);
  });
  beforeEach(async () => {
    await clearDatabase(orm);
    em = orm.em.fork();
  });
  afterAll(async () => {
    await orm.close();
  });

  async function insertEntities(entities: AnyEntity[]): Promise<void> {
    await em.fork().persistAndFlush(entities);
  }

  it("Should be able to remove deduction from checkout", async () => {
    let checkout = new Checkout();
    checkout.discountDeduction = new DiscountDeduction(1000);
    await insertEntities([checkout]);

    checkout = await em.findOneOrFail(Checkout, checkout.id, ['discountDeduction']);

    // Check deduction loads correctly
    expect(checkout.discountDeduction.amount).toBe(1000)

    em.remove(checkout.discountDeduction);
    checkout.discountDeduction.checkout = null;
    await em.flush();

    checkout = await em.findOneOrFail(Checkout, checkout.id, ['discountDeduction']);

    expect(checkout.discountDeduction).toBeNull();
  });

  it("Should be able to remove deduction from checkout and add new deduction", async () => {
    let checkout = new Checkout();
    checkout.discountDeduction = new DiscountDeduction(1000);
    await insertEntities([checkout]);

    checkout = await em.findOneOrFail(Checkout, checkout.id, ['discountDeduction']);

    // Check deduction loads correctly
    expect(checkout.discountDeduction.amount).toBe(1000)

    // Try to remove current discount deduction, then add a new one in a single transaction
    // Transactino should be like so:
    // 1. Remove old deduction
    // 2. Insert new deduction
    em.remove(checkout.discountDeduction);
    checkout.discountDeduction.checkout = null;
    checkout.discountDeduction = new DiscountDeduction(2000);
    await em.persistAndFlush(checkout);

    checkout = await em.findOneOrFail(Checkout, checkout.id, ['discountDeduction']);
    const deductions = await em.find(DiscountDeduction, {});

    expect(checkout.discountDeduction.amount).toBe(2000);
    expect(deductions.length).toBe(1);
  });
});
