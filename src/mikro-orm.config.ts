import { Options } from '@mikro-orm/core';
import { MySqlDriver } from '@mikro-orm/mysql';
import dotenv from 'dotenv';

import { Driver, Vehicle, Car, Bicycle } from './database/entities';

dotenv.config();

const config: Options<MySqlDriver> = {
  type: 'mysql',
  host: process.env.SQL_HOST,
  port: Number(process.env.SQL_PORT) || 3306,
  user: process.env.SQL_USERNAME,
  password: process.env.SQL_PASSWORD,
  dbName: process.env.SQL_DATABASE_NAME,
  debug: true,
  entities: [Vehicle, Car, Bicycle, Driver],
};

export default config;
