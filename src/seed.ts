import { NestFactory } from '@nestjs/core';
import { SeederModule } from './seeders/seeder.module';
import { Seeder } from './seeders/seeder.provider';

import { Logger } from '@nestjs/common';

export async function bootstrapSeed() {
  const app = await NestFactory.createApplicationContext(SeederModule);

  const seeder = app.get(Seeder);

  try {
    await seeder.seed();
    Logger.debug('Seeding complete!');
  } catch (error) {
    Logger.log(error);
    Logger.error('Seeding failed!');
    throw error;
  } finally {
    app.close();
  }
}
