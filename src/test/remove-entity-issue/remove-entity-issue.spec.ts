import { AnyEntity, MikroORM } from "@mikro-orm/core";
import { EntityManager, MySqlDriver } from "@mikro-orm/mysql";

import config from "../../mikro-orm.config";
import { clearDatabase, migrateDatabase } from "../test-helpers";
import { Checkout } from "./Checkout.entity";
import { Discount } from "./Discount.entity";

describe.skip("Remove entiy issue", () => {
  let orm: MikroORM<MySqlDriver>;
  let em: EntityManager;

  beforeAll(async () => {
    orm = await MikroORM.init({
      ...config,
      debug: true,
      entities: [Discount, Checkout],
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

  it("Should be able to remove discount from checkout", async () => {
    let checkout = new Checkout();
    checkout.discount = new Discount(1000);
    await insertEntities([checkout]);

    checkout = await em.findOneOrFail(Checkout, checkout.id, { populate: ['discount'] });

    // Check discount loads correctly
    expect(checkout.discount.amount).toBe(1000)

    em.remove(checkout.discount);
    await em.flush();

    checkout = await em.fork().findOneOrFail(Checkout, checkout.id, { populate: ['discount'] });

    expect(checkout.discount).toBeFalsy();
  });

  it("Should be able to remove discount from checkout and add new discount", async () => {
    let checkout = new Checkout();
    checkout.discount = new Discount(1000);
    await insertEntities([checkout]);

    checkout = await em.findOneOrFail(Checkout, checkout.id, { populate: ['discount'] });

    // Check discount loads correctly
    expect(checkout.discount.amount).toBe(1000)

    // Try to remove current discount discount, then add a new one in a single transaction
    // Transaction should be like so:
    // 1. Remove old discount
    // 2. Insert new discount
    em.remove(checkout.discount);
    // checkout.discount = null;
    checkout.discount = new Discount(2000);
    // console.log(em.getUnitOfWork().getRemoveStack());
    // console.log(em.getUnitOfWork().getPersistStack());
    // HOWEVER, when flush runs, the removal never happens, or at least the insert is being attempted first,
    // causing a unique constraint violation at the SQL level
    await em.flush();

    // Assert
    const newEm = em.fork();
    checkout = await newEm.findOneOrFail(Checkout, checkout.id, { populate: ['discount'] });
    const discounts = await newEm.find(Discount, {});

    expect(checkout.discount.amount).toBe(2000);
    expect(discounts.length).toBe(1);
  });
});
