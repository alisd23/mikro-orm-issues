// Those first two require are very important - without them the typescript migrations did not work for me.
// See https://github.com/facebook/jest/issues/10178
// tslint:disable-next-line: no-var-requires
require('ts-node/register');

import { MikroORM } from '@mikro-orm/core';
import dotenv from 'dotenv';

dotenv.config();

/*
 * This file is executed by Jest before running any tests.
 * We drop the database and re-create it usiung the mikroOrm schema generator
 */
export default async () => {
  console.log('\n===== JEST GLOBAL SETUP =====\n');

  const t0 = Date.now();

  const orm = await MikroORM.init();
  const generator = orm.getSchemaGenerator();

  console.log(`> Dropping database schema: ${orm.config.get('dbName')}`);
  await generator.dropSchema(undefined, true);

  const connectTime = Date.now();

  const migrator = orm.getMigrator();
  console.log('> Running Migrations');
  const migrations = await migrator.up();

  const migrationTime = Date.now();

  console.log(
    '👩‍🔬 Migrations completed:',
    migrations.map(m => m.file),
  );

  console.log(
    `👩‍🔬 Connected in ${connectTime -
      t0}ms - Executed migrations in ${migrationTime - connectTime}ms.`,
  );

  await orm.close(true);
};
