import { MikroORM } from '@mikro-orm/core';

import { Address, Manager } from '../database/entities';

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
  let orm: MikroORM;

  beforeAll(async () => {
    orm = await MikroORM.init();
  });
  beforeEach(async () => {
    await clearDatabase(orm);
  });
  afterAll(async () => {
    await orm.close();
  });

  describe('STI collection issue', () => {
    it('Should allow creation of child entities with collections', async () => {
      const manager = new Manager();
      manager.addresses.add(new Address('some address', manager));

      await orm.em.persistAndFlush(manager);
    });
  });
});
