import { MikroORM } from "@mikro-orm/core";

/**
 * Delete all records from all the entity tables in the database
 * (excluding migration table)
 */
 export async function clearDatabase(orm: MikroORM) {
  const entities = Object.values(orm.getMetadata().getAll());
  const connection = orm.em.getConnection();

  await connection.execute("SET FOREIGN_KEY_CHECKS = 0");
  const tableNames = new Set(
    entities
      .filter((entity) => !entity.embeddable && !entity.abstract)
      .map((entity) => entity.tableName)
  );
  for (const tableName of tableNames) {
    await connection.execute(`TRUNCATE TABLE ${tableName}`);
  }
  await connection.execute("SET FOREIGN_KEY_CHECKS = 1");
}

export async function migrateDatabase(orm: MikroORM) {
  const generator = orm.getSchemaGenerator();

  console.log(`> Dropping database schema: ${orm.config.get('dbName')}`);
  await generator.dropSchema({
    dropMigrationsTable: true,
  });

  console.log('> Creating schema from entities');
  await generator.createSchema();

  console.log('👩‍🔬 Schema creation completed');
}