import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DriverService } from './driver.service';
import { DriverController } from './driver.controller';
import { Driver } from './driver.entity';
import { TripModule } from '../trip/trip.module';

@Module({
  imports: [TypeOrmModule.forFeature([Driver]), TripModule],
  controllers: [DriverController],
  providers: [DriverService],
  exports: [DriverService],
})
export class DriverModule {}
