import { AnyEntity, MikroORM } from "@mikro-orm/core";
import { EntityManager, MySqlDriver } from "@mikro-orm/mysql";

import config from "../../mikro-orm.config";
import { clearDatabase, migrateDatabase } from "../test-helpers";
import { Person } from "./Person.entity";
import { Car } from "./Car.entity";

describe("Remove entiy issue", () => {
  let orm: MikroORM<MySqlDriver>;
  let em: EntityManager;

  beforeAll(async () => {
    orm = await MikroORM.init({
      ...config,
      debug: true,
      entities: [Person, Car],
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

  /**
   * Insert entities using forked entity manager
   */
  async function insertEntities(entities: AnyEntity[]): Promise<void> {
    await em.fork().persistAndFlush(entities);
  }

  it("Should be able to assign existing entity to another via 1-to-1 relationship (owner side)", async () => {
    let car = new Car();
    await insertEntities([car]);

    car = await em.findOneOrFail(Car, car.id, { populate: ['person']});

    const newPerson = new Person();
    car.person = newPerson;
    // Check value before flush
    expect(car.person).toBeTruthy();
    expect(newPerson.car).toBeTruthy();

    await em.persistAndFlush(newPerson);

    // Refetch and check relation (owner side)
    car = await em.fork().findOneOrFail(Car, car.id, { populate: ['person'] });
    expect(car.person).toBeTruthy();

    // Refetch and check relation (inverse side)
    const person = await em.fork().findOneOrFail(Person, newPerson.id, { populate: ['car'] });
    expect(person.car).toBeTruthy();
  });

  it("Should be able to assign existing entity to another via 1-to-1 relationship (inverse side)", async () => {
    let car = new Car();
    await insertEntities([car]);

    car = await em.findOneOrFail(Car, car.id, { populate: ['person']});

    const newPerson = new Person();
    newPerson.car = car;
    // Check value before flush
    expect(car.person).toBeTruthy();
    expect(newPerson.car).toBeTruthy();

    await em.persistAndFlush(newPerson);

    // Refetch and check relation
    car = await em.fork().findOneOrFail(Car, car.id, { populate: ['person'] });
    expect(car.person).toBeTruthy();

    // Refetch and check relation (inverse side)
    const person = await em.fork().findOneOrFail(Person, newPerson.id, { populate: ['car'] });
    expect(person.car).toBeTruthy();
  });
});
