import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverModule } from '../driver/driver.module';
import { TripModule } from '../trip/trip.module';
import { Rider } from './rider.entity';
import { RiderService } from './rider.service';
import { RiderController } from './rider.controller';
import { IntegrationModule } from '../integration/integration.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Rider]),
    TripModule,
    DriverModule,
    IntegrationModule,
  ],
  controllers: [RiderController],
  providers: [RiderService],
})
export class RiderModule {}
