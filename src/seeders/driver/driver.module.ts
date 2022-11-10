import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Driver } from '../../driver/driver.entity';
import { DriverSeederService } from './driver.service';
import { Trip } from '../../trip/trip.entity';
import { Rider } from '../../rider/rider.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Driver, Trip, Rider])],
  providers: [DriverSeederService],
  exports: [DriverSeederService],
})
export class DriverSeederModule {}
