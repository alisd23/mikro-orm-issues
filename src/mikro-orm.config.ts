import { Options } from '@mikro-orm/core';
import { MySqlDriver } from '@mikro-orm/mysql';
import dotenv from 'dotenv';

dotenv.config();

const config: Options<MySqlDriver> = {
  type: 'mysql',
  host: process.env.SQL_HOST,
  port: Number(process.env.SQL_PORT) || 3306,
  user: process.env.SQL_USERNAME,
  password: process.env.SQL_PASSWORD,
  dbName: process.env.SQL_DATABASE_NAME,
  debug: true,
  entitiesTs: ['src/database/entity/**/*.ts'],
  entities: ['dist/database/entity/**/*.js'],
};

export default config;
