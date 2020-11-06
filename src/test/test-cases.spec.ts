import { MikroORM } from '@mikro-orm/core';
import { EntityManager, MySqlDriver } from '@mikro-orm/mysql';

import { Driver, Bicycle, Car, Vehicle } from '../database/entities';

/**
 * Delete all records from all the entity tables in the database
 * (excluding migration table)
 */
export async function clearDatabase(orm: MikroORM) {
  const entities = Object.values(orm.getMetadata().getAll());
  const connection = orm.em.getConnection();

  await connection.execute('SET FOREIGN_KEY_CHECKS = 0');
  const tableNames = new Set(
    entities
      .filter(entity => !entity.embeddable && !entity.abstract)
      .map(entity => entity.tableName),
  );
  for (const tableName of tableNames) {
    await connection.execute(`TRUNCATE TABLE ${tableName}`);
  }
  await connection.execute('SET FOREIGN_KEY_CHECKS = 1');
}

describe('Bug test cases', () => {
  let orm: MikroORM<MySqlDriver>;
  let em: EntityManager;

  beforeAll(async () => {
    orm = await MikroORM.init();
  });
  beforeEach(async () => {
    em = orm.em.fork();
    await clearDatabase(orm);
  });
  afterAll(async () => {
    await orm.close();
  });

  describe('STI collection issue', () => {
    it('Should allow creation of child entities with collections', async () => {
      const bicycle = new Bicycle(4);
      bicycle.drivers.add(new Driver('Sandra', bicycle));

      await em.persistAndFlush(bicycle);
    });
  });

  describe('STI entity class unpack issue', () => {
    it('Should assign entity to correct child class', async () => {
      const bicycle = new Bicycle(4);
      const car = new Car('hr');
      await em.fork().persistAndFlush([bicycle, car]);

      const returnedBicycle = await em.findOne(Vehicle, bicycle.id);
      expect(returnedBicycle).toBeInstanceOf(Bicycle);

      const returnedCar = await em.findOne(Vehicle, car.id);
      expect(returnedCar).toBeInstanceOf(Car);
    });

    it('Should map child entity to correct class', async () => {
      const car = new Car('V8');
      const driver = new Driver('Bob', car);
      await em.fork().persistAndFlush([car, driver]);

      const driverWithVehicle = await em.findOne(Driver, driver.id, [
        'vehicle',
      ]);

      expect(driverWithVehicle.vehicle.type).toBe('car');
      expect((driverWithVehicle.vehicle as Car).engine).toBe('V8');
      expect(driverWithVehicle.vehicle).toBeInstanceOf(Car);
    });
  });
});
