import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trip } from './trip.entity';
import { TripService } from './trip.service';
import { IntegrationModule } from '../integration/integration.module';

@Module({
  imports: [TypeOrmModule.forFeature([Trip]), IntegrationModule],
  providers: [TripService],
  exports: [TripService],
})
export class TripModule {}
