import { Module } from '@nestjs/common';
import { Seeder } from './seeder.provider';
import { DriverSeederModule } from './driver/driver.module';
import { DatabaseModule } from '../database/database.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, DriverSeederModule],
  providers: [Seeder],
})
export class SeederModule {}
