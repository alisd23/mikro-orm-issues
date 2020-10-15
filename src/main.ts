import { NestFactory } from '@nestjs/core';
import { MikroORM } from '@mikro-orm/core';
import { MySqlDriver } from '@mikro-orm/mysql';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);

  const orm = await MikroORM.init<MySqlDriver>();

  const entities = Object.values(orm.getMetadata().getAll());
  console.log(entities);
}

bootstrap();
